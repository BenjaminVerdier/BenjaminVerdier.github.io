using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class FakeArmController : MonoBehaviour {
    public Transform joint1, joint2, joint3;
    public Slider sliderAlpha, sliderBeta, sliderGamma;
    private Quaternion j1, j2, j3;
    private Vector3 r1, r2, r3;
    // Use this for initialization
    void Start () {
	    
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void UpdateJoint1()
    {
        j1 = joint1.localRotation;
        r1 = j1.eulerAngles;
        r1.x = sliderAlpha.value;
        j1.eulerAngles = r1;
        joint1.localRotation = j1;
    }

    void UpdateJoint2()
    {
        j2 = joint2.localRotation;
        r2 = j2.eulerAngles;
        if (sliderBeta.value > 90)
        {
            r2.x = 180 - sliderBeta.value;
            r2.y = 180;
            r2.z = 180;
        }
        else if (sliderBeta.value < -90)
        {
            r2.x = 180 - sliderBeta.value;
            r2.y = 180;
            r2.z = 180;
        }
        else
        {
            r2.x = sliderBeta.value;
            r2.y = 0;
            r2.z = 0;
        }
        j2.eulerAngles = r2;
        joint2.localRotation = j2;
    }

    void UpdateJoint3()
    {
        j3 = joint3.localRotation;
        r3 = j3.eulerAngles;
        if (sliderGamma.value > 90)
        {
            r3.x = 180 - sliderGamma.value;
            r3.y = 180;
            r3.z = 180;
        } else if (sliderGamma.value < -90) {
            r3.x = 180 - sliderGamma.value;
            r3.y = 180;
            r3.z = 180;
        } else
        {
            r3.x = sliderGamma.value;
            r3.y = 0;
            r3.z = 0;
        }
        j3.eulerAngles = r3;
        joint3.localRotation = j3;
    }
}
