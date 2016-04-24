using UnityEngine;
using System.Collections;

public class AlignYAxis : MonoBehaviour {
    public Transform arm;
    private Quaternion q;
    private Vector3 v;
	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
        q = this.transform.rotation;
        v = q.eulerAngles;
        v.y = arm.transform.rotation.eulerAngles.y;
        q.eulerAngles = v;
        this.transform.rotation = q;
	}
}
