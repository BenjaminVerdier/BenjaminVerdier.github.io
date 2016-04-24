using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class UpdateMode : MonoBehaviour {
    public TaskController tc;
    private Text text;
	// Use this for initialization
	void Start () {
        text = this.GetComponent<Text>();
    }
	
	// Update is called once per frame
	void Update () {
	    if (tc.goToConfiguration || tc.graspDaBall)
        {
            text.text = "Auto Mode";
        } else
        {
            text.text = "Manual Mode";
        }
	}
}
