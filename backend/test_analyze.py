import os
import django
import sys
import json

# Setup django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "resumely.settings")
django.setup()

from api.services.nvidia_service import nvidia_ai

resume_text = "John Doe\nSoftware Engineer\n5 years experience in Python and React."
instructions = "Score this from 0 to 100 on ATS compatibility. Identify strengths and weaknesses."

print("Calling Nvidia AI...")
response = nvidia_ai.analyze_resume(resume_text, instructions)
print("RAW RESPONSE:")
print("===============")
print(response)
print("===============")

try:
    data = json.loads(response)
    print("Parsed JSON successfully!")
except Exception as e:
    print("FAILED TO PARSE JSON")
    
    start = response.find("{")
    end = response.rfind("}") + 1
    if start != -1 and end > start:
        print("TRYING TO EXTRACT SUBSTRING:")
        try:
            data = json.loads(response[start:end])
            print("Extracted substring parsed successfully!")
        except Exception as e2:
            print("SUBSTRING ALSO FAILED!", e2)
