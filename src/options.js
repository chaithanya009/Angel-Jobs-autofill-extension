import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useRef } from "react";
import "./options.css";

const App = () => {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({ value: "" });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [name,setName] = useState('')
  const [showTick, setShowTick] = useState(false);
  const selectedTemplateRef = useRef(null);
  const notSelectedTemplateRef = useRef(null);
  useEffect(() => {
    chrome.storage.sync.get(["templates",'default_template'], (items) => {
      console.log(items)
      if(items.default_template){
        setNewTemplate(items.default_template)
        setSelectedTemplate(items.default_template)
        setName(items.default_template.name)
      }
      if (items.templates) {
      setTemplates(items?.templates.map((t)=>({...t,selected:t.number===(items.default_template && items.default_template)?.number?true:false})))
      }

    });
   setTimeout(()=>selectedTemplateRef?.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  }),500);
  }, []);

  const handleSubmit = async () => {
    if (selectedTemplate) {
      // Update selected template
      const updatedTemplates = templates.map((template) => {
        if (template.number === selectedTemplate.number) {
          
          return { ...template, value: newTemplate.value,name:name };
        }
        return template;
      });
      chrome.storage.sync.set({
        default_template:selectedTemplate,
      });
      await chrome.storage.sync.set({
        templates: updatedTemplates,
      });
      setTemplates(updatedTemplates);
     // setSelectedTemplate(null);
    } else {
      // Create new template
      const updatedTemplates = [
        { value: newTemplate.value, number: templates.length + 1,name:name },
        ...templates,
      ];

      await chrome.storage.sync.set({
        templates: updatedTemplates,
      });
      setTemplates(updatedTemplates);
      setNewTemplate({ value: "" });
      setName('')
    }
    setShowTick(true);
    setTimeout(() => {
      setShowTick(false);
    }, 2000);
  };

  const handleClick = (template) => {
    setSelectedTemplate(template);
    setName(template?.name ? template.name :'')
    setNewTemplate({ value: template.value });
    setTemplates(templates.map((t)=>({...t,selected: t===template?true:false})))

  };
console.log(templates)
  return (
    <>
    <div className="new-t" onClick={()=>{setNewTemplate({ value: "" });setSelectedTemplate(null);setName('')}}>CREATE TEMPLATE</div>
    <div className="all-templates">
    {templates.filter((t) => typeof t?.value === 'string' && t?.value?.length > 0).reverse()
.map((template, index) => (
      <div
      ref={template?.selected === true ? selectedTemplateRef : notSelectedTemplateRef }
        className={template?.selected===true ?'template':undefined}
        key={index}
        style={{ cursor: "pointer" }}
        onClick={() => handleClick(template)}
      > 
        <div className="template-title">{template?.name || ''}</div>
        {template?.value?.slice(0, 20) + "...."}
      </div>
    ))}
    </div>
    

<input
    placeholder="TITLE"
   value={name}
  onChange={(e) => {setName(e.target.value);
    if(selectedTemplate)
    setSelectedTemplate({...selectedTemplate, name: e.target.value })}
  }
  className='input-tag'
/>

    <form id="options-form" onSubmit={(e) => {
  e.preventDefault();
  if (newTemplate.value !== "") handleSubmit();
}}>
      <textarea
        className="user_input"
        placeholder="Dear Hiring Manager,

        I am excited to apply for the {role} position at {company}. My name is {name} and I am confident that my skills and experience make me a strong candidate for the role.
        
        Thank you for considering my application.
        
        Best regards,
        {name}"
        id="userInput"
        type="text"
        value={newTemplate.value}
        onChange={(e) => {setNewTemplate({ value: e.target.value });
        if(selectedTemplate)
        setSelectedTemplate({...selectedTemplate, value: e.target.value })}}
      />
      <p>{'When you apply for a job, the placeholders {role}, {company}, and {name} will be replaced with the actual role, company name, and your name, respectively:'}</p>

<p>Dear Hiring Manager,

I am excited to apply for the Software Engineer position at Google. My name is John Smith and I am confident that my skills and experience make me a strong candidate for the role.

Thank you for considering my application.

Best regards,
John Smith</p>
      <button
        id="click-here"
        className="BUTTON"
        onClick={newTemplate.value !== "" ? handleSubmit : null}
      >
        {selectedTemplate ? "Set As Default" : "Submit"}
      </button>
      <span>{showTick && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="#5cb85c" d="M22.5 5.5l-12 12-6-6" />
    </svg>}</span>
    </form>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
