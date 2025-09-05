from app.agent.prompts.code_agent_prompt import CODE_AGENT_SYSTEM_PROMPT
from app.agent.prompts.knowledge_agent_prompt import KNOWLEDGE_AGENT_SYSTEM_PROMPT
from app.agent.prompts.quiz_agent_prompt import QUIZ_AGENT_PROMPT
from app.agent.prompts.roadmap_agent_prompt import ROADMAP_AGENT_PROMPT
from app.agent.prompts.visual_agent_prompt import VISUAL_AGENT_PROMPT
from app.agent.tools.input_formatting_tool import format_agent_input_func_tool
from app.agent.tools.knowledge_agent_tools import wikidata_agent_func_tool
from app.agent.tools.roadmap_agent_tools import youtube_agent_func_tool
from app.agent.tools.visual_tool import fetch_image_url_tool_func_tool
from google.adk.agents import Agent
from google.adk.tools import agent_tool

# knowledge agent
knowledge_agent = Agent(
    name="KnowledgeAgent",
    model="gemini-2.5-flash",
    instruction=KNOWLEDGE_AGENT_SYSTEM_PROMPT,
    tools=[format_agent_input_func_tool, wikidata_agent_func_tool],
    description="Specialized agent for answering conceptual and knowledge-based queries for Computer Science students",
)

# code agent
code_agent = Agent(
    name="CodeAgent",
    model="gemini-2.5-flash",
    instruction=CODE_AGENT_SYSTEM_PROMPT,
    tools=[format_agent_input_func_tool],
    description="Specialized agent for handling programming, debugging, and code-related queries",
)

# quiz agent
quiz_agent = Agent(
    name="QuizAgent",
    model="gemini-2.5-flash",
    instruction=QUIZ_AGENT_PROMPT,
    tools=[format_agent_input_func_tool, wikidata_agent_func_tool],
    description="Specialized agent for generating quizzes, MCQs, and practice questions",
)

# roadmap agent
roadmap_agent = Agent(
    name="RoadmapAgent",
    model="gemini-2.5-flash",
    instruction=ROADMAP_AGENT_PROMPT,
    tools=[format_agent_input_func_tool, youtube_agent_func_tool],
    description="Specialized agent for providing structured learning paths and study plans",
)

# visual agent
visual_agent = Agent(
    name="VisualLearningAgent",
    model="gemini-2.5-flash",
    instruction=VISUAL_AGENT_PROMPT,
    tools=[format_agent_input_func_tool, fetch_image_url_tool_func_tool],
    description="Specialized agent for creating visual learning aids, diagrams, and charts",
)

# orchestrator agent (tutor agent)
tutor_agent = Agent(
    name="TutorAgent",
    model="gemini-2.0-flash",
    tools=[
        agent_tool.AgentTool(agent=knowledge_agent),
        agent_tool.AgentTool(agent=code_agent),
        agent_tool.AgentTool(agent=quiz_agent),
        agent_tool.AgentTool(agent=roadmap_agent),
        agent_tool.AgentTool(agent=visual_agent),
    ],
    description="Central orchestrator agent that routes queries to appropriate specialized agents",
)
