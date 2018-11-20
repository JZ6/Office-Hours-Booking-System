from api import create_app
import logging

logging.basicConfig(level=logging.DEBUG)

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000, host="0.0.0.0")
