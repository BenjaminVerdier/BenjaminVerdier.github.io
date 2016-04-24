using UnityEngine;
using System.Collections;

public class ArmController : MonoBehaviour {
    public HingeJoint rotationy, pincer1, pincer2, pincer3, lowerArm, middleArm, upperArm;
    public bool manualControl;
    private JointMotor motory, motorp1, motorp2, motorp3, motorla, motorma, motorua;
	// Use this for initialization
	void Start () {
        GetMotors();
    }
	
	// Update is called once per frame
	void Update () {
        GetMotors();
        if (manualControl)
        {

            if (Input.GetKey(KeyCode.Space))
            {
                motorp1.targetVelocity = 30;
                motorp2.targetVelocity = 30;
                motorp3.targetVelocity = 30;
            }
            else if (Input.GetKey(KeyCode.LeftControl))
            {
                motorp1.targetVelocity = -30;
                motorp2.targetVelocity = -30;
                motorp3.targetVelocity = -30;
            }

            if (Input.GetKey(KeyCode.Q))
            {
                motorla.targetVelocity = 20;
            }
            else if (Input.GetKey(KeyCode.W))
            {
                motorla.targetVelocity = -20;
            }
            else
            {
                motorla.targetVelocity = 0;
            }

            if (Input.GetKey(KeyCode.A))
            {
                motorma.targetVelocity = 20;
            }
            else if (Input.GetKey(KeyCode.S))
            {
                motorma.targetVelocity = -20;
            }
            else
            {
                motorma.targetVelocity = 0;
            }

            if (Input.GetKey(KeyCode.Z))
            {
                motorua.targetVelocity = 20;
            }
            else if (Input.GetKey(KeyCode.X))
            {
                motorua.targetVelocity = -20;
            }
            else
            {
                motorua.targetVelocity = 0;
            }

            if (Input.GetKey(KeyCode.LeftArrow))
            {
                motory.targetVelocity = 15;
            }
            else if (Input.GetKey(KeyCode.RightArrow))
            {
                motory.targetVelocity = -15;
            }
            else
            {
                motory.targetVelocity = 0;
            }

            AttributeMotors();

        }
    }

    void AttributeMotors()
    {
        rotationy.motor = motory;
        pincer1.motor = motorp1;
        pincer2.motor = motorp2;
        pincer3.motor = motorp3;
        lowerArm.motor = motorla;
        middleArm.motor = motorma;
        upperArm.motor = motorua;
    }

    void GetMotors()
    {
        motory = rotationy.motor;
        motorp1 = pincer1.motor;
        motorp2 = pincer2.motor;
        motorp3 = pincer3.motor;
        motorla = lowerArm.motor;
        motorma = middleArm.motor;
        motorua = upperArm.motor;
    }

    void UpdateManualControl()
    {
        manualControl = !manualControl;
    }
}
