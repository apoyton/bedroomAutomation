import cv2
import numpy as np
import io
import base64

# Load the cascades
frontFace = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt2.xml')
sideFace = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
fullbody = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_fullbody.xml')
upperbody = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_upperbody.xml')
lowerbody = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_lowerbody.xml')

def lookForHuman(image):
    facesFound = display_image_from_data(image)
    if facesFound > 0:
        return True
    else:
        return False

def display_image_from_data(binary_data):
    try:
        intrusionsFound = 0

        image_data = np.frombuffer(binary_data, dtype=np.uint8)
        image = image_data.reshape((240, 320)) #240(height) x 320(width)
    
        image = np.transpose(image) # Transpose the image (rotate so its upsidedown)
        image = np.flipud(image) # Flip the image vertically

        # Convert grayscale image to RGB if needed
        if len(image.shape) == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    
        # Detect bodies
        frontFaces = frontFace.detectMultiScale(image, 1.1, 4)
        sideFaces = sideFace.detectMultiScale(image, 1.1, 4)
        fullBodies = fullbody.detectMultiScale(image, 1.1, 4)
        upperBodies = upperbody.detectMultiScale(image, 1.1, 4)
        lowerBodies = lowerbody.detectMultiScale(image, 1.1, 4)

        # cv2.rectangle(image, start_point, end_point, color, thickness)
        # Draw rectangle around the faces
        for (x, y, w, h) in frontFaces:
            cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
        
        # Draw rectangle around the faces
        for (x, y, w, h) in sideFaces:
            cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
        # Draw rectangle around the faces
        for (x, y, w, h) in fullBodies:
            cv2.rectangle(image, (x, y), (x+w, y+h), (0, 0, 255), 2)

        # Draw rectangle around the faces
        for (x, y, w, h) in upperBodies:
            cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 255), 2)
        
        # Draw rectangle around the faces
        for (x, y, w, h) in lowerBodies:
            cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 255), 2)
        
        intrusionsFound = len(frontFaces) + len(sideFaces) + len(fullBodies) + len(upperBodies) + len(lowerBodies)

        try:
            cv2.imwrite("image.jpg", image)
            print("Image saved as", "image.jpg")

        except Exception as e:
            print("Error saving image:", e)

        return intrusionsFound
    
    except Exception as e:
        print("Image not recieved properly")
        return 0
    
