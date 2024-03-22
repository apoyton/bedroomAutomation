import cv2
import numpy as np
import io
import base64

def lookForHuman(image):
    display_image_from_data(image)
    human = True
    if human:
        return True
    else:
        return False

def display_image_from_data(binary_data):
    image_data = np.frombuffer(binary_data, dtype=np.uint8)
    print(image_data)
    print(image_data.shape)
    
    # Reshape the NumPy array to the image dimensions (assuming 320x240)
    image = image_data.reshape((240, 320)) #240(height) x 320(width)
    #print(image)
    #print(image.shape)
    
    # Display the grayscale image using OpenCV
    #cv2.imshow('Grayscale Image', image)
    #cv2.waitKey(0)
    #cv2.destroyAllWindows()
    try:
        cv2.imwrite("image.jpg", image)

        print("Image saved as", "image.jpg")

    except Exception as e:
        print("Error saving image:", e)
