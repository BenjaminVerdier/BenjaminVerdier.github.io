using UnityEngine;
using System.Collections;

public class SceneController : MonoBehaviour {

    private Vector3 pos;

	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
	    if (Input.GetKeyDown(KeyCode.B))
        {
            GameObject sphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            sphere.transform.localScale *= .8f;
            sphere.AddComponent<Rigidbody>();
            GetRandomPosition();
            sphere.transform.position = pos;
            sphere.tag = "TargetSphere";
            sphere.AddComponent<DestroyOnFall>();
        }
	}

    void GetRandomPosition()
    {
        pos = Random.insideUnitCircle * 6;
        pos.x += 1.5f;
        pos.y += 1.5f;
        pos.z = pos.y;
        pos.y = 1;
    }
}
