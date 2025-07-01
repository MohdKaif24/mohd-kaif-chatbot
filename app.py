
from flask import Flask, render_template, request, jsonify
import openai
import os

app = Flask(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json['message']

    if user_input.lower().startswith("image:"):
        prompt = user_input[len("image:"):].strip()
        try:
            response = openai.Image.create(
                prompt=prompt,
                n=1,
                size="512x512"
            )
            image_url = response['data'][0]['url']
            return jsonify({'reply': "Yeh rahi tumhari tasveer ✨", 'image_url': image_url})
        except Exception as e:
            return jsonify({'reply': f"Image generate nahi ho paayi: {str(e)}"})

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are Mohd. Kaif, an AI assistant who speaks Hindi and English, helps with YouTube growth, and general queries."},
            {"role": "user", "content": user_input}
        ]
    )
    reply = response['choices'][0]['message']['content']
    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
