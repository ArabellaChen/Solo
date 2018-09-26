# import cv2
# import numpy as np
# from matplotlib import pyplot as plt
#
# img = cv2.imread('opencv.png')
#
# blur = cv2.blur(img,(5,5))
#
#
#
# plt.subplot(121),plt.imshow(img),plt.title('Original')
# plt.xticks([]), plt.yticks([])
# plt.subplot(122),plt.imshow(blur),plt.title('Blurred')
# plt.xticks([]), plt.yticks([])
# plt.show()

import cv2
import numpy as np

def nothing(x):
    pass

# Create a black image, a window
img = np.zeros((300,512,3), np.uint8)
cv2.namedWindow('image')

# create trackbars for color change
cv2.createTrackbar('R','image',0,255,nothing)
cv2.createTrackbar('G','image',0,255,nothing)
cv2.createTrackbar('B','image',0,255,nothing)

# create switch for ON/OFF functionality
# switch = '0 : OFF \n1 : ON'
# cv2.createTrackbar(switch, 'image',0,1,nothing)

while(1):
    cv2.imshow('image',img)
    k = cv2.waitKey(0) & 0xFF
    if k == 27:
        break

    # get current positions of four trackbars
    r = cv2.getTrackbarPos('R','image')
    g = cv2.getTrackbarPos('G','image')
    b = cv2.getTrackbarPos('B','image')
    s = cv2.getTrackbarPos(switch,'image')

    if s == 0:
        img[:] = 0
    else:
        img[:] = [b,g,r]

cv2.destroyAllWindows()



# // Naming Rules:
# // 1. All words start with capital letter
# // 2. No double spaces bettween words
# // 3. No space at the beginning
# // 4. No space at the end
# // function namingRule(str){
# //   var name = "";
# //   var arr = str.split(" ");
# //   for(var i = 0; i <arr.length; i++){
# //     if(arr[i].length > 0){
# //       name += arr[i].charAt(0).toUpperCase()+ arr[i].slice(1) + " "
# //     }
# //   }
# //   return name.trim();
# // }
# //
# // Parse.Cloud.beforeSave("Patient", function(request, response) {
# //   if (request.object.get("first_name").length > 0) {
# //     request.object.set("first_name", namingRule(request.object.get("first_name")));
# //   }
# //   if (request.object.get("last_name").length > 0) {
# //     request.object.set("last_name", namingRule(request.object.get("last_name")));
# //   }
# //   response.success();
# // });
