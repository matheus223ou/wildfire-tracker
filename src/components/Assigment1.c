/* COP 3223C PAI
This program is written by: Matheus Valle de Castro */

#include <stdio.h>
#include <math.h>

#define PI 3.14159

int main(void){
    double x1,x2, y1,y2; 
    printf("Please enter the first point (x1 and y1): ");
    scanf("%lf %lf", &x1, &y1);
    printf("Please enter the second point (x2 and y2): ");
    scanf("%lf %lf", &x2,&y2);

    distance=sqrt(pow((x2-x1),2)+pow((y2-y1),2));
    radius=distance/2
    Area=PI*pow(radius,2);

    return 0;
    


}