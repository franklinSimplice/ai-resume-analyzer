import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def generate_resume(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        # Get the API Key sent by the app
        api_key = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        # Prepare the prompt for OpenRouter
        prompt = f"Generate a professional resume for {data['personalInfo']['name']}..."
        
        payload = {
            "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
            "messages": [{"role": "user", "content": prompt}]
        }
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post("https://openrouter.ai/api/v1/chat/completions", 
                                     headers=headers, 
                                     data=json.dumps(payload))
            response_data = response.json()
            resume_text = response_data['choices'][0]['message']['content']
            
            return JsonResponse({"resumeText": resume_text})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)