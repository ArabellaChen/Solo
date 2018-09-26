import cv2
import numpy as np

# filename = 'chessboard.png'
filename = 'box.jpg'
img = cv2.imread(filename)
# resize to 50% of the origin
img = cv2.resize(img, (0, 0), None, 1, 1)
gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

gray = np.float32(gray)
dst = cv2.cornerHarris(gray,7,3,0.05)


# Threshold for an optimal value, it may vary depending on the image.
# dst > 0.01 * dst.max()
# the code gives the coordinate of the 'corners' in your image.
img[dst>0.01*dst.max()]=[0,0,255]

# Create a black image recording the cornner points in the image
black = np.zeros(img.shape, np.float32)
black[dst>0.01*dst.max()]=[0,0,255]
cv2.imshow('blank',black)

cv2.imshow('dst',img)
if cv2.waitKey(0) & 0xff == 27:
    cv2.destroyAllWindows()
