using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public class TaskController : MonoBehaviour
{

    //public variables
    public float alpha, beta, gamma, sphereAngle; //Angles of arm parts compared to the previous one.
    public bool goToConfiguration, closeHand, graspDaBall; //made public to monitor
    public Slider sliderAlpha, sliderBeta, sliderGamma; //sliders that give the values of each angle.
    public HingeJoint lowerArm, middleArm, upperArm, pincer1, pincer2, pincer3, rotationy; //Joints
    public Transform portion1, portion2, portion3, armBase; //Parts of the arm, used to get the current angles
    public float maxSpeed, maxSpeedY;
    public Vector3 pFactor, iFactor, dFactor; //Factors of the pid controller
    public Color selectedColor; //Color of the selected ball
    public EventSystem evSys; //The event system, used to monitor mouse clicks
    public ArmController ac; //The manual controller of the arm

    //movement related variables
    private JointMotor motorla, motorma, motorua, motorp1, motorp2, motorp3, motory; //Motors of the joints
    public Vector3 currAngle; // Current angles of the arm
    public Vector3 diffAngle; // Error of the angles
    private float currBaseRot, diffBaseRot; // Same, but with the y angle of the base
    public float eps, epsRot; // Error allowed when position is reached
    //variables used in pid controller
    private Vector3 previousErr, derivErr, sumErr;
    private Vector3 iFactorMem, dFactorMem; //Used to memorize the factors for when the user deactivate the integration/derivation
    private int steps; //number of steps since last reset

    //other
    private GameObject sphere; //the Sphere targeted
    private Color sphereCol; //the original color of the sphere
    private bool onConfiguration, graspingStep, calculationStep, finished, wasAutoMode;

    // Use this for initialization
    void Start()
    {
        goToConfiguration = false;
        closeHand = false;
        alpha = beta = gamma = 0;
        GetCurrAngles();
        eps = 1f;
        GetMotors();
        sphere = null;
        sphereCol = new Color();
        epsRot = 0.5f;
        graspDaBall = false;
        onConfiguration = false;
        graspingStep = false;
        finished = false;
        iFactorMem = new Vector3();
        dFactorMem = new Vector3();
    }

    // Update is called once per frame
    void Update()
    {
        SelectSphere();
        GetCurrAngles();
        GetMotors();
        if (goToConfiguration)
        {
            GoToConfiguration();
        }
        if (sphere)
        {
            FaceSelectedBall();
        }
        if (graspDaBall && sphere)
        {
            if (calculationStep)
            {
                CalculateGraspingPosition();
                sliderAlpha.value -= 20;
                goToConfiguration = true;
                calculationStep = false;
            }
            GetCurrAngles();
            if (IsOnConfiguration() && !graspingStep)
            {
                graspingStep = true;
            }
            if (finished)
            {
                graspingStep = false;
                graspDaBall = false;
                DeselectBall();
                StartCoroutine(WaitBeforeGoToPosition());
            }
            if (graspingStep)
            {
                sliderAlpha.value += .1f;
            }
        }
        AttributeMotors();
    }

    void GetCurrAngles()
    {
        currAngle.x = portion1.localRotation.eulerAngles.x;
        if (currAngle.x > 180) { currAngle.x -= 360; }  //deals with discontinuity of angle measurements
        diffAngle.x = currAngle.x - alpha;

        currAngle.y = portion2.localRotation.eulerAngles.x;

        if (portion2.localRotation.eulerAngles.y > 170 && portion2.localRotation.eulerAngles.z > 170 &&
            portion2.localRotation.eulerAngles.y < 190 && portion2.localRotation.eulerAngles.z < 190)
        //There is an issue when the part has an angle of more than 90° : it counts backward and the y and z angles become 180°. This fixes the issue.
        {
            currAngle.y = 180 - currAngle.y;
        }

        if (currAngle.y > 180) { currAngle.y -= 360; }
        diffAngle.y = -currAngle.y + beta;

        currAngle.z = portion3.localRotation.eulerAngles.x;

        if (portion3.localRotation.eulerAngles.y > 170 && portion3.localRotation.eulerAngles.z > 170 &&
            portion3.localRotation.eulerAngles.y < 190 && portion3.localRotation.eulerAngles.z < 190)
        {
            currAngle.z = 180 - currAngle.z;
        }

        if (currAngle.z > 180) { currAngle.z -= 360; }
        diffAngle.z = -currAngle.z + gamma;

        if (sphere)
        {
            Vector3 tmp = armBase.InverseTransformPoint(sphere.transform.position);
            diffBaseRot = Mathf.Atan2(tmp.x, tmp.z) * Mathf.Rad2Deg;
        }
    }

    void AttributeMotors() //Update of the motors
    {
        pincer1.motor = motorp1;
        pincer2.motor = motorp2;
        pincer3.motor = motorp3;
        lowerArm.motor = motorla;
        middleArm.motor = motorma;
        upperArm.motor = motorua;
        rotationy.motor = motory;
    }

    void GetMotors()
    {
        motorp1 = pincer1.motor;
        motorp2 = pincer2.motor;
        motorp3 = pincer3.motor;
        motorla = lowerArm.motor;
        motorma = middleArm.motor;
        motorua = upperArm.motor;
        motory = rotationy.motor;
    }

    void UpdateAlpha()
    {
        alpha = sliderAlpha.value;
    }

    void UpdateBeta()
    {
        beta = sliderBeta.value;
    }

    void UpdateGamma()
    {
        gamma = sliderGamma.value;
    }

    void UpdateGoTo()
    {
        goToConfiguration = !goToConfiguration;
        StopAllCoroutines();
        ResetPIDValues();
        graspingStep = false;
    }

    void UpdateCloseHand()
    {
        closeHand = !closeHand;
    }

    void SelectSphere()
    {
        if (Input.GetMouseButtonDown(0))
        {
            RaycastHit hitInfo = new RaycastHit();
            if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hitInfo) && hitInfo.transform.tag == "TargetSphere")
            {
                if (sphere) { ResetSphereColor(); }
                sphere = hitInfo.transform.gameObject;
                UpdateSphereColor();
            }
            else if (evSys.currentSelectedGameObject == null)
            {
                DeselectBall();
            }
        }
    }

    void UpdateSphereColor()
    {
        sphereCol = sphere.GetComponent<Renderer>().material.color;
        sphere.GetComponent<Renderer>().material.color = selectedColor;
    }

    void ResetSphereColor()
    {
        sphere.GetComponent<Renderer>().material.color = sphereCol;
    }

    void GoToConfiguration()
    {
        UpdatePIDValues();

        if (Mathf.Abs(diffAngle.x) > 0)
        {
            motorla.targetVelocity = Mathf.Clamp(diffAngle.x * pFactor.x + sumErr.x * iFactor.x + derivErr.x * dFactor.x, -maxSpeed, maxSpeed);
        }
        else
        {
            motorla.targetVelocity = 0;
        }
        if (Mathf.Abs(diffAngle.y) > 0)
        {
            motorma.targetVelocity = -Mathf.Clamp(diffAngle.y * pFactor.y + sumErr.y * iFactor.y + derivErr.y * dFactor.y, -maxSpeed, maxSpeed); ;
        }
        else
        {
            motorma.targetVelocity = 0;
        }

        if (Mathf.Abs(diffAngle.z) > 0)
        {
            motorua.targetVelocity = -Mathf.Clamp(diffAngle.z * pFactor.z + sumErr.z * iFactor.z + derivErr.z * dFactor.z, -maxSpeed, maxSpeed); ;
        }
        else
        {
            motorua.targetVelocity = 0;
        }

        ToggleHand();

    }

    void ToggleHand()
    {
        if (closeHand)
        {
            motorp1.targetVelocity = 30;
            motorp2.targetVelocity = 30;
            motorp3.targetVelocity = 30;
        }
        else
        {
            motorp1.targetVelocity = -30;
            motorp2.targetVelocity = -30;
            motorp3.targetVelocity = -30;
        }
    }

    bool IsOnConfiguration()
    {
        return (Mathf.Abs(diffAngle.x) < eps) && (Mathf.Abs(diffAngle.y) < eps) && (Mathf.Abs(diffAngle.z) < eps) && (Mathf.Abs(diffBaseRot) < epsRot) && (derivErr.sqrMagnitude < .5);
    }

    void FaceSelectedBall()
    {
        if (Mathf.Abs(diffBaseRot) > epsRot)
        {
            motory.targetVelocity = Mathf.Clamp(diffBaseRot * 1f, -maxSpeedY, maxSpeedY); //TODO: change 1.5 and 30 to public values that we can change and monitor
        }
        else
        {
            motory.targetVelocity = 0;
        }
    }

    void CalculateGraspingPosition()
    {
        if (!(sphere))
        {
            return;
        }
        /*
        First we setup the variables we will need: the angles and the points in the plane between the base of the arm
        and the sphere we want to grasp.
        */
        Vector2 targetPoint = new Vector2();

        Vector3 posArm = new Vector3();
        Vector3 posSphere = sphere.transform.position;
        posSphere.y = 0;

        float distance = Vector3.Distance(posSphere, posArm);
        targetPoint.x = distance - sphere.transform.localScale.x * Mathf.Cos(Mathf.PI / 4) * 0.5f;
        targetPoint.y = sphere.transform.localScale.x * 0.5f + sphere.transform.localScale.x * Mathf.Sin(Mathf.PI / 4) * 0.5f;

        CalculateAnglesToPoint(targetPoint);
    }

    void CalculateAnglesToPoint(Vector2 targetPoint)
    {
        float tempAlpha, tempBeta, tempGamma;
        tempAlpha = 0;
        //bool computeAngles = true;
        Vector2 fstPoint = new Vector2();
        Vector2 sndPoint = new Vector2();
        Vector2 trdPoint = new Vector2();
        Vector2 originPoint = new Vector2(0, 0.2f);
        /*
        The value of 3.6 is the distance between each joint's anchor.
        */
        /*
         * This is with assuming an angle of 45° between the last portion and the center of ball.
         */
        fstPoint = originPoint;
        trdPoint = targetPoint;
        trdPoint.x -= 3.6f * Mathf.Cos(Mathf.PI / 4);
        trdPoint.y += 3.6f * Mathf.Cos(Mathf.PI / 4);

        Circle c1 = new Circle(fstPoint, 3.6f);
        Circle c2 = new Circle(trdPoint, 3.6f);

        sndPoint = Circle.Intersect(c1, c2);

        if ((sndPoint.x != 0 || sndPoint.y != 0) && !float.IsNaN(sndPoint.x) && !float.IsNaN(sndPoint.y))
        {
            sliderAlpha.value = 0;
            sliderBeta.value = 0;
            sliderGamma.value = 0;
        }
        Vector2 y = new Vector2(0, 1);
        tempAlpha = -Vector2.Angle(sndPoint - fstPoint, y);
        tempBeta = Vector2.Angle(sndPoint - fstPoint, trdPoint - sndPoint);
        tempGamma = Vector2.Angle(trdPoint - sndPoint, targetPoint - trdPoint);

        sliderAlpha.value = tempAlpha;
        sliderBeta.value = tempBeta;
        sliderGamma.value = tempGamma;
    }

    void BallTouched()
    {
        if (graspDaBall)
        {
            GetMotors();
            graspingStep = false;
            closeHand = true;
            ToggleHand();
            AttributeMotors();
            finished = true;
        }
    }

    void UpdateGraspDaBall()
    {
        if (sphere != null && !graspDaBall)
        {
            graspDaBall = true;
            calculationStep = true;
            graspingStep = false;
            finished = false;
            StopAllCoroutines();
            wasAutoMode = goToConfiguration;
            ac.manualControl = false;
            goToConfiguration = false;

        }
        else
        {
            graspDaBall = false;
            StopAllCoroutines();
            goToConfiguration = wasAutoMode;
            ac.manualControl = !wasAutoMode;
        }
    }

    IEnumerator WaitBeforeGoToPosition()
    {
        //We wait for the hand to close before going to the original position
        yield return new WaitForSeconds(2);
        sliderAlpha.value = 0;
        sliderBeta.value = 0;
        sliderGamma.value = 0;
    }

    void ResetMotors()
    {
        //Just in case
        GetMotors();
        motorla.targetVelocity = 0;
        motorma.targetVelocity = 0;
        motorua.targetVelocity = 0;
        motory.targetVelocity = 0;
        ToggleHand();
        AttributeMotors();
    }

    void DeselectBall()
    {
        if (sphere) { ResetSphereColor(); }
        sphere = null;
        GetMotors();
        motory.targetVelocity = 0;
        AttributeMotors();
    }

    void UpdatePIDValues()
    {
        sumErr = steps * sumErr + diffAngle;
        steps++;
        sumErr /= steps;
        derivErr = diffAngle - previousErr;
        previousErr = diffAngle;
    }

    void ResetPIDValues()
    {
        sumErr = new Vector3();
        derivErr = new Vector3();
        previousErr = new Vector3();
        steps = 0;
    }

    void SwapIntegrationControl()
    {
        Vector3 tmp = iFactor;
        iFactor = iFactorMem;
        iFactorMem = tmp;
    }

    void SwapDerivationControl()
    {
        Vector3 tmp = dFactor;
        dFactor = dFactorMem;
        dFactorMem = tmp;
    }
}
