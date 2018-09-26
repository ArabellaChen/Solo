import numpy as np
import cv2

# Create a black image
img = np.zeros((500,500,3), np.uint8)

# use arrowedLine draw antenna
cv2.arrowedLine(img, (220, 60), (200, 30), (255,0,255), 3, 8, 0, 1)
cv2.arrowedLine(img, (280, 60), (300, 30), (255,0,255), 3, 8, 0, 1)

# use circle draw face and eyes
cv2.circle(img, (250,100), 40, (255,0,0), 3)
cv2.circle(img, (230,90), 2, (255,255,0), 3)
cv2.circle(img, (270,90), 2, (255,255,0), 3)

# use ellipse draw mouth and nose
cv2.ellipse(img, (250,100), (5,5), 90, 0, 200, (0,255,255), 2)
cv2.ellipse(img, (250,120), (20,3), 180, 0, 360, (0,0,255), 2)

# use rectangle draw body
cv2.rectangle(img, (180, 150), (320, 260), (255,255,0), 3)

# use line draw arm
cv2.line(img, (160,170), (100,200), (0,255,0), 3)
cv2.line(img, (340,170), (400,200), (0,255,0), 3)

# use polylines draw leg
pts = np.array([[200,270],[210,390],[180,400],[180,420], [230,420] ,[235,270]], np.int32)
pts = pts.reshape((-1,1,2))
cv2.polylines(img,[pts],True,(0,255,255), 3)

pts = np.array([[300,270],[290,390],[320,400],[320,420], [270,420] ,[265,270]], np.int32)
pts = pts.reshape((-1,1,2))
cv2.polylines(img,[pts],True,(0,255,255), 3)

# Write some Text
font = cv2.FONT_HERSHEY_SIMPLEX
cv2.putText(img,'Who am I ?',(160,470), font, 1,(255,255,255),2)

cv2.imshow("drawing", img)
cv2.waitKey()
