import fitz


BLANK_PAGES = [0, 1, 2, 4, 5, 9, 14, 15, 17, 19, 20, 21]


def corners_to_center(top_left, bottom_right):
    pass

doc = fitz.open('article.pdf')
rect = fitz.Rect(30, 30, 200, 200)
file = open("terminal_eps.png", "rb")
img = file.read()
file.close()

doc[2].insertImage(rect, stream=img)


doc.save("article3.pdf")