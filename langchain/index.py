import os
import subprocess
from pydantic import BaseModel
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# 1. Define a strongly typed tool schema
class ShellCommand(BaseModel):
    command: str

def execute_shell(command: str) -> str:
    """Executes a command safely in the local shell environment and returns stdout/stderr."""
    # Guardrail: Prevent destructive or hanging commands in a production/local context
    if "rm -rf /" in command or "ssh" in command:
        return "Error: Command blocked by guardrail security."
        
    try:
        result = subprocess.run(
            command, shell=True, capture_output=True, text=True, timeout=30
        )
        return f"STDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
    except subprocess.TimeoutExpired:
        return "Error: Command timed out after 30 seconds."

# 2. Wire the tool up to the LLM (Using OpenAI's tool-calling standard)
tools = [
    {
        "type": "function",
        "function": {
            "name": "execute_shell",
            "description": "Run shell commands, local tests (pytest/npm test), check git status, or read/write files via shell.",
            "parameters": {
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "The exact bash/zsh command to execute."}
                },
                "required": ["command"]
            }
        }
    }
]

# 3. Basic ReAct Execution Loop Example
def run_agent(user_prompt: str):
    messages = [
        {"role": "system", "content": "You are an expert full-stack developer assistant. Use tools when needed."},
        {"role": "user", "content": user_prompt}
    ]
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools
    )
    
    tool_calls = response.choices[0].message.tool_calls
    if tool_calls:
        for tool_call in tool_calls:
            if tool_call.function.name == "execute_shell":
                # Parse arguments safely
                import json
                args = json.loads(tool_call.function.arguments)
                print(f"═> Agent wants to execute: {args['command']}")
                
                # Run the tool and feed the observation back
                observation = execute_shell(args['command'])
                print(f"═> Observation Result:\n{observation}")
                
                # (In a full loop, you append this observation to messages and call the LLM again)

# Example execution to triage local project status
# run_agent("Check if my current backend tests are passing right now.")