from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain.tools.retriever import create_retriever_tool
from langchain.tools import Tool
from langchain.agents import AgentExecutor, create_react_agent
from langchain.globals import set_debug, set_verbose
from langchain.memory import ConversationBufferWindowMemory
from .tools import *
from .prompt import *

set_verbose(False)
set_debug(False)

# Embedding Model
embedding_function = HuggingFaceEmbeddings(
    model_name='sentence-transformers/all-MiniLM-L6-v2')
vector_db = Chroma(persist_directory='chroma_db_nccn',
                   embedding_function=embedding_function)

retriever = vector_db.as_retriever()

llm = ChatOpenAI(base_url='http://localhost:1234/v1', api_key='lm-studio')

conversation_state = ConversationState()

retrieval_tool = create_retriever_tool(retriever, 'hr_policy_retriever_tool',
                                       'Search for information about HR Policies. For any questions about HR Policies, you must use this tool!')

get_todays_date_tool = Tool(
    name='Get Today Date',
    description="Useful for getting today's date",
    func=DateTool().run,
)

get_user_details_tool = Tool(
    name='Get User Details',
    description=("Use this tool when you need to retrieve specific user details from the available data. "
                 "Provide any key related to the user's information, such as 'employee_code', 'first_name', "
                 "'last_name', 'doj', 'program', 'designation', 'personal_email', 'official_email', 'bank_name', "
                 "or 'account_no', and the tool will return the corresponding value."),
    func=GetUserDetailsTool(user_data=user_data).run
)
    
update_bank_detail_tool = Tool(
    name="Update Bank Account",
    description="Useful when the user want to update there bank account details.",
    func=UpdateBankDetailsTool().run,
    return_direct=True
)

user_salary_not_received_tool = Tool(
    name="Salary Not Received",
    description="Useful when the user have not received salary.",
    func=UserSalaryNotReceivedTool(user_data=user_data).run,
    return_direct=True
)

handle_salary_issue_tool = Tool(
    name="Handle Salary Issue",
    description=(
        "This tool should be used when an employee reports receiving less or incorrect salary. "
        "The input for salary not received is less or incorrect salary"
    ),
    func=HandleSalaryIssueTool(conversation_state, user_data=user_data).run,
    return_direct=True
)

payslip_correction_tool = Tool(
    name="Payslip Correction or Salary Slip Correction",
    description=(
        "Use this tool when the user needs to correct their payslip/salary slip, particularly if it involves changing their designation or department. "
        "Ask the user if they want to update their designation or department, and use their response as the input for the correction process."
    ),
    func=PayslipCorrectionTool(user_data=user_data).run,
    return_direct=True
)

tools = [retrieval_tool,
         #  get_todays_date_tool,
         #  get_user_details_tool,
         update_bank_detail_tool,
         user_salary_not_received_tool,
         handle_salary_issue_tool,
         payslip_correction_tool,
         ]

react_agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)

conversational_memory = ConversationBufferWindowMemory(
    memory_key='chat_history',
    k=3,
    return_messages=True
)

agent = AgentExecutor(
    agent=react_agent,
    tools=tools,
    handle_parsing_errors=True,
    memory=conversational_memory,
    max_execution_time=60,
)
