import argparse
import os
from PIL import Image
import math

def main():
    parser = argparse.ArgumentParser(description="Bild in Karten aufteilen")
    parser.add_argument("--input", required=True, help="Pfad zum Eingabebild")
    parser.add_argument("--rows", type=int, required=True, help="Anzahl der Reihen")
    parser.add_argument("--cols", type=int, required=True, help="Anzahl der Spalten")
    parser.add_argument("--out", default="output", help="Ausgabeordner")

    args = parser.parse_args()

    image = Image.open(args.input)
    width, height = image.size

    card_width = width // args.cols
    card_height = height // args.rows

    os.makedirs(args.out, exist_ok=True)

    counter = 0

    for r in range(args.rows):
        for c in range(args.cols):
            left   = c * card_width
            upper  = r * card_height
            right  = left + card_width
            lower  = upper + card_height

            num = counter // 2
            prefix = "front" if counter % 2 == 0 else "back"
            card = image.crop((left, upper, right, lower))
            card.save(os.path.join(args.out, f"{prefix}_{num}.png"))
            counter += 1

    print(f"Fertig! {counter} Karten gespeichert in '{args.out}'")

if __name__ == "__main__":
    main()
