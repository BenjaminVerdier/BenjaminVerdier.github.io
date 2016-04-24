using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class EditValue : MonoBehaviour {
    public Slider slider;
    private Text text;
	// Use this for initialization
	void Start () {
        text = this.GetComponent<Text>();
        text.text = slider.value.ToString("#.##") ;
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void ChangeValue()
    {
        text.text = slider.value.ToString("#.##");
    }
}
