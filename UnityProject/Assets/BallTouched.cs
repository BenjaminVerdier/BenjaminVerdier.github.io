using UnityEngine;
using System.Collections;

public class BallTouched : MonoBehaviour {
    public TaskController tc;
	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
	}

    void OnCollisionEnter(Collision col)
    {
        if (col.gameObject.tag == "TargetSphere")
        {
            tc.SendMessage("BallTouched");
        }
    }
}
