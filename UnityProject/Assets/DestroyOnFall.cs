using UnityEngine;
using System.Collections;

public class DestroyOnFall : MonoBehaviour {
    private Transform t;
	// Use this for initialization
	void Start () {
        t = this.transform;
	}
	
	// Update is called once per frame
	void Update () {
	    if (t.position.y < 0)
        {
            GameObject.Destroy(this.gameObject);
        }
	}
}
