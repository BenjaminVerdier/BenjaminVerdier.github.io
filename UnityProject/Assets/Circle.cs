using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using System.Collections;


class Circle
{
    public Vector2 center;
    public float radius;

    public Circle()
    {
        center = new Vector2();
        radius = 1;
    }

    public Circle(Vector2 v, float r)
    {
        center = v;
        radius = r;
    }

    public static Vector2 Intersect(Circle c1, Circle c2)
    {
        Vector2 result = new Vector2();

        float dist = Vector2.Distance(c2.center, c1.center);
        Console.Write(dist);

        if (dist > c1.radius + c2.radius || dist < Math.Abs(c1.radius - c2.radius))
        {
            return result; //no Solution, we return (0,0)
        }

        float a = (c1.radius * c1.radius - c2.radius * c2.radius + dist * dist) / (2 * dist); //abscissa of intersection point when the x axis is the line between the two centers.
        float h = Mathf.Sqrt(c1.radius * c1.radius - a * a); //ordinate in the same configuration
        Vector2 intermediate = c1.center + a * (c2.center - c1.center) / dist;
        result.x = intermediate.x - h * (c2.center.y - c1.center.y) / dist;
        result.y = intermediate.y + h * (c2.center.x - c1.center.x) / dist;

        //result.x = h;

        return result;
    }
}
