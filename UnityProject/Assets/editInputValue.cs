using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class editInputValue : MonoBehaviour {
    public Slider slider;
    private InputField inputField;
	// Use this for initialization
	void Start () {
        inputField = this.GetComponent<InputField>();
        inputField.text = slider.value.ToString("#.##");
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void EditValue()
    {
        inputField.text = slider.value.ToString("#.##");
    }
}
