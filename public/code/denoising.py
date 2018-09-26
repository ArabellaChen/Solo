import cv2
import numpy as np

img = cv2.imread('lena.png')
cv2.imshow('original', img)

# void cv::blur(  InputArray 	src,
#                 OutputArray 	dst,
#                 Size 	        ksize,
#                 Point 	    anchor = Point(-1,-1),
#                 int 	        borderType = BORDER_DEFAULT
#              )
box = cv2.blur(img,(7,7))
cv2.imshow('box', box)

# void cv::GaussianBlur(  InputArray 	src,
#                         OutputArray 	dst,
#                         Size 	        ksize,
#                         double 	    sigmaX,
#                         double 	    sigmaY = 0,
#                         int           borderType = BORDER_DEFAULT
#                      )
# if both sigmaX and sigmaY are zeros, they are computed from ksize.width and ksize.height, respectively
gaussian = cv2.GaussianBlur(img,(7,7), 3)
cv2.imshow('gaussian', gaussian)

# void cv::medianBlur(	InputArray 	   src,
#                       OutputArray    dst,
#                       int 	       ksize
#                     )
# ksize	aperture linear size; it must be odd and greater than 1, for example: 3, 5, 7 ...
median = cv2.medianBlur(img,5)
cv2.imshow('median', median)

# void cv::bilateralFilter(   InputArray     src,
#                             OutputArray 	 dst,
#                             int 	         d,
#                             double 	     sigmaColor,
#                             double 	     sigmaSpace,
#                             int 	         borderType = BORDER_DEFAULT
#                         )
# Sigma values: For simplicity, you can set the 2 sigma values to be the same. If they are small (< 10),
#               the filter will not have much effect, whereas if they are large (> 150), they will have a
#               very strong effect, making the image look "cartoonish".
#
# Filter size: Large filters (d > 5) are very slow, so it is recommended to use d=5 for real-time
#              applications, and perhaps d=9 for offline applications that need heavy noise filtering.
bilateral = cv2.bilateralFilter(img,11,35,35)
cv2.imshow('bilateral', bilateral)


# void cv::cuda::fastNlMeansDenoisingColored(   InputArray 	src,
#                                               OutputArray dst,
#                                               float 	    h_luminance,
#                                               float 	    photo_render,
#                                               int 	    search_window = 21,
#                                               int 	    block_size = 7,
#                                               Stream & 	stream = Stream::Null()
#                                           )
# h_luminance:	    Parameter regulating filter strength. Big h value perfectly removes noise but also
#                   removes image details, smaller h value preserves details but also preserves some noise
# photo_render:	    float The same as h but for color components. For most images value equals 10 will be
#                   enough to remove colored noise and do not distort colors
# search_window:	Size in pixels of the window that is used to compute weighted average for given pixel.
#                   Should be odd. Affect performance linearly: greater search_window - greater denoising time.
#                   Recommended value 21 pixels
# block_size:       Size in pixels of the template patch that is used to compute weights. Should be odd.
#                   Recommended value 7 pixels
NlMeans = cv2.fastNlMeansDenoisingColored(img,None,10,10,21,7)
cv2.imshow('fastNlMeansDenoisingColored', NlMeans)

cv2.waitKey()
