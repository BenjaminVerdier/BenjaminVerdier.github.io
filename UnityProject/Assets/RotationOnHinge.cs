using UnityEngine;
using System.Collections;

public class RotationOnHinge : MonoBehaviour {

    private HingeJoint hinge;
    public bool useMotor;

	// Use this for initialization
	void Start () {
        hinge = GetComponent<HingeJoint>();
	}
	
	// Update is called once per frame
	void Update () {
	    if (useMotor)
        {
            hinge.useMotor = true;
        }
	}
}
