from PIL import Image
from io import BytesIO
import numpy as np
import cv2
import math
import json
from scipy import ndimage


class BytesToPictureConverter:

    @staticmethod
    def convert(b_image):
        try:
            data = json.loads(b_image)["data"]
            img = Image.open(BytesIO(bytes(data))).convert("RGBA")
            background = Image.new('RGBA', img.size, (255, 255, 255))
            alpha_composite = Image.alpha_composite(background, img)
            image_rgb = alpha_composite.convert('RGB')
            gray = cv2.cvtColor(np.array(image_rgb), cv2.COLOR_RGB2GRAY)
            gray = cv2.resize(255 - gray, (28, 28))
            (thresh, gray) = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

            while np.sum(gray[0]) == 0:
                gray = gray[1:]

            while np.sum(gray[:, 0]) == 0:
                gray = np.delete(gray, 0, 1)

            while np.sum(gray[-1]) == 0:
                gray = gray[:-1]

            while np.sum(gray[:, -1]) == 0:
                gray = np.delete(gray, -1, 1)

            rows, cols = gray.shape

            if rows > cols:
                factor = 20.0 / rows
                rows = 20
                cols = int(round(cols * factor))
                gray = cv2.resize(gray, (cols, rows))
            else:
                factor = 20.0 / cols
                cols = 20
                rows = int(round(rows * factor))
                gray = cv2.resize(gray, (cols, rows))

            colsPadding = (int(math.ceil((28 - cols) / 2.0)), int(math.floor((28 - cols) / 2.0)))
            rowsPadding = (int(math.ceil((28 - rows) / 2.0)), int(math.floor((28 - rows) / 2.0)))
            gray = np.lib.pad(gray, (rowsPadding, colsPadding), 'constant')

            shiftx, shifty = get_best_shift(gray)
            shifted = shift(gray, shiftx, shifty)
            gray = shifted

            return gray.reshape((784, 1)) / 255
        except Exception:
            raise


def get_best_shift(img):
    cy, cx = ndimage.center_of_mass(img)

    rows, cols = img.shape
    shiftx = np.round(cols / 2.0 - cx).astype(int)
    shifty = np.round(rows / 2.0 - cy).astype(int)

    return shiftx, shifty


def shift(img, sx, sy):
    rows, cols = img.shape
    M = np.float32([[1, 0, sx], [0, 1, sy]])
    shifted = cv2.warpAffine(img, M, (cols, rows))
    return shifted