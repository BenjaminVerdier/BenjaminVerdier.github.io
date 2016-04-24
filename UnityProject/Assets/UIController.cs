using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class UIController : MonoBehaviour {
    public Slider s1, s2, s3;

	// Use this for initialization
	void Start () {
        	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void ResetSliders()
    {
        s1.value = 0;
        s2.value = 0;
        s3.value = 0;
    }
}
