using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class editSliderValue : MonoBehaviour {
    public Text inputText;
    private float min, max;
    private Slider slider;
	// Use this for initialization
	void Start () {
        slider = this.GetComponent<Slider>();
        min = slider.minValue;
        max = slider.maxValue;
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void EditValue()
    {
        float val = float.Parse(inputText.text);
        if (val > max) { inputText.text = max.ToString(); }
        if (val < min) { inputText.text = min.ToString(); }
        slider.value = float.Parse(inputText.text);
    }
}
