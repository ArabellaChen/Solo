import cv2
import numpy as np

# loading image
img = cv2.imread('home.jpg')

# resize to 50% of the origin
img = cv2.resize(img, (0, 0), None, .5, .5)

# remove noise using gaussian blur
blur = cv2.GaussianBlur(img,(3,3),0)
cv2.imshow("gaussian", blur)

# converting to gray scale
gray = cv2.cvtColor(blur, cv2.COLOR_BGR2GRAY)

# convolute with proper kernels
laplacian = cv2.Laplacian(gray,cv2.CV_64F)
sobelx = cv2.Sobel(gray,cv2.CV_64F,1,0,ksize=5)  # x
sobely = cv2.Sobel(gray,cv2.CV_64F,0,1,ksize=5)  # y
canny = cv2.Canny(gray,100,150)

cv2.imshow("origin", img)
cv2.imshow("laplacian", laplacian)
cv2.imshow("sobelx", sobelx)
cv2.imshow("sobely", sobely)
cv2.imshow("canny", canny)

weightDiffEdge = img.copy()
cv2.addWeighted(img, 3, blur, -3, 100, weightDiffEdge);
cv2.imshow("weightDiffEdge", weightDiffEdge)
cv2.imwrite("weightDiffEdge.png", weightDiffEdge)

addWeight = img.copy()
cv2.addWeighted(img, 10, blur, -10, 0, addWeight);
cv2.imshow("edgeFromWeightDiff", addWeight)
cv2.imwrite("edgeFromWeightDiff.png", addWeight)

cv2.addWeighted(img, 10, blur, -9, 0, img);
cv2.imshow("edge enhancement", img)
cv2.imwrite("edgeEnhancement.png", img)

cv2.waitKey()
