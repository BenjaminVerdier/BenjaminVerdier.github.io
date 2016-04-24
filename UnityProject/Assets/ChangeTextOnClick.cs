using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class ChangeTextOnClick : MonoBehaviour {
    private bool manual;
    public string s1, s2;
    public Text text;
	// Use this for initialization
	void Start () {
        manual = true;
        text.text = s1;
	}
	
	// Update is called once per frame
	void Update () {
	    
	}

    void UpdateMessage()
    {
        manual = !manual;
        if (manual)
        {
            text.text = s1;
        } else
        {
            text.text = s2;
        }
    }
}
