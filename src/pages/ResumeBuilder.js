import React, { useState, useEffect, useRef } from 'react';
import './ResumeBuilder.css';

function ResumeBuilder() {
  // State for resume data
  const [state, setState] = useState({
    name: "", headline: "",
    email: "", phone: "", location: "",
    website: "", linkedin: "", github: "",
    summary: "",
    skills: "",
    experience: [],
    education: [],
    template: 'classic',
    accent: '#2563eb',
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    titleSize: 34,
    headerSize: 13,
    summarySize: 13,
    skillsSize: 12,
    experienceSize: 13,
    educationSize: 13
  });

  const fileInputRef = useRef(null);
  const [showTypography, setShowTypography] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light', 'dark', 'high-contrast'

  // Helper functions
  const esc = (s) => (s || "").replace(/[&<>]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;"}[c]));
  const nl2br = (t) => esc(t || "").replace(/\n/g, '<br>');
  const commaList = (s) => (s || "").split(/,\s*/).map(x => x.trim()).filter(Boolean);
  const move = (arr, i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  // Format bullet points for display
  const formatBullets = (t) => {
    if (!t) return '';
    const lines = t.split('\n');
    const formatted = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.startsWith('• ') ? line : `• ${line}`)
      .join('\n');
    return esc(formatted);
  };

  // Save JSON function
  const saveJSON = () => {
    try {
      const jsonData = JSON.stringify(state, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (state.name || 'resume').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '') + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      console.log('Resume saved successfully');
    } catch (e) {
      console.error('Error saving JSON:', e);
      alert('Error saving file. Please try again.');
    }
  };

  // Load JSON function
  const loadJSONFiles = (files) => {
    try {
      const list = Array.from(files || []).filter(f => /\.json$/i.test(f.name));
      if (!list.length) {
        alert('Please select a valid JSON file.');
        return;
      }
      const f = list[0];
      const r = new FileReader();
      r.onload = () => {
        try {
          const loadedData = JSON.parse(r.result);
          setState(prevState => ({ ...prevState, ...loadedData }));
          console.log('Resume loaded successfully:', f.name);
        } catch (e) {
          console.error('Error loading JSON:', e);
          alert('Invalid JSON file. Please check the file format.');
        }
      };
      r.onerror = () => {
        console.error('Error reading file:', r.error);
        alert('Error reading file. Please try again.');
      };
      r.readAsText(f);
    } catch (e) {
      console.error('Error in loadJSONFiles:', e);
      alert('Error loading file. Please try again.');
    }
  };

  // Export PDF function
  const exportPDF = () => {
    const PAGE_W = 816, PAGE_H = 1056;
    const pages = 1; // Default to 1 page for now
    const w = window.open('', '_blank');
    
    // Get the paper element content
    const paperElement = document.getElementById('paper');
    if (!paperElement) return;
    
    const styles = `
      <style>
        :root{ --accent:${state.accent}; --ink:#111827; --muted:#6b7280; --paper:#fff; --bg:#f3f4f6; }
        *{box-sizing:border-box}
        body{margin:0;font-family:${state.fontFamily};color:var(--ink);background:var(--bg)}
        .paper{ --pad:26px;background:var(--paper);width:100%;max-width:816px;min-height:1056px;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.06);padding:var(--pad); }
        .name{font-size:${state.titleSize}px;font-weight:800;letter-spacing:.2px}
        .role{font-size:16px;color:var(--muted);margin-top:3px}
        .contact{margin-top:8px;font-size:12px;color:#374151}
        .section{margin-top:18px}
        .section h3{font-size:${state.headerSize}px;letter-spacing:1.4px;text-transform:uppercase;color:var(--accent);border-bottom:1.5px solid var(--accent);padding-bottom:4px;margin:0 0 8px}
        .summary{font-size:${state.summarySize}px}
        .skills-section{font-size:${state.skillsSize}px}
        .experience-section{font-size:${state.experienceSize}px}
        .education-section{font-size:${state.educationSize}px}
        ul{margin:6px 0 0 18px;padding:0}
        li{margin:4px 0}
        @page{size:letter;margin:16mm}
        @media print{ body{background:#fff} .paper{width:auto;min-height:auto;box-shadow:none;border:none} }
      </style>
    `;

    const html = paperElement.outerHTML;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume PDF</title>${styles}</head><body>${html}<script>setTimeout(()=>{window.print()},50)</script></body></html>`);
    w.document.close();
  };

  // Show DOCX instructions
  const showDOCXInstructions = () => {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      max-width: 600px;
      max-height: 90%;
      overflow: auto;
      padding: 30px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = `
      <h2 style="margin: 0 0 20px 0; color: #2563eb; font-size: 24px;">📄 Convert PDF to DOCX</h2>
      <p>1. Export PDF using the button above</p>
      <p>2. Use online converters like smallpdf.com or ilovepdf.com</p>
      <p>3. Or open in Microsoft Word directly</p>
      <button onclick="this.closest('.docx-modal').remove()" style="margin-top: 25px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; width: 100%;">Got it!</button>
    `;
    
    modal.appendChild(modalContent);
    modal.className = 'docx-modal';
    document.body.appendChild(modal);
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  // Handle experience changes
  const handleExperienceChange = (index, field, value) => {
    setState(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Handle education changes
  const handleEducationChange = (index, field, value) => {
    setState(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Add experience
  const addExperience = () => {
    setState(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', place: '', dates: '', desc: '', bullets: '' }]
    }));
  };

  // Add education
  const addEducation = () => {
    setState(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '', place: '', details: '' }]
    }));
  };

  // Delete experience
  const deleteExperience = (index) => {
    setState(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Delete education
  const deleteEducation = (index) => {
    setState(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Move experience up/down
  const moveExperience = (index, direction) => {
    setState(prev => {
      const newExp = [...prev.experience];
      move(newExp, index, direction);
      return { ...prev, experience: newExp };
    });
  };

  // Move education up/down
  const moveEducation = (index, direction) => {
    setState(prev => {
      const newEdu = [...prev.education];
      move(newEdu, index, direction);
      return { ...prev, education: newEdu };
    });
  };

  // Handle Enter key in textareas
  const handleKeyDown = (e, index, field, isExperience = true) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '\n• ' + value.substring(end);
      
      if (isExperience) {
        handleExperienceChange(index, field, newValue);
      } else {
        handleEducationChange(index, field, newValue);
      }
      
      // Set cursor position after the new bullet point
      setTimeout(() => {
        const newCursorPos = start + 3;
        e.target.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  // Setup inline editing for preview
  useEffect(() => {
    const setupInlineEditing = () => {
      const paper = document.getElementById('paper');
      if (!paper) return;

      const editables = paper.querySelectorAll('.editable');
      
      editables.forEach(el => {
        // Remove existing listeners
        el.removeEventListener('focus', handlePreviewFocus);
        el.removeEventListener('blur', handlePreviewBlur);
        el.removeEventListener('input', handlePreviewInput);
        el.removeEventListener('keydown', handlePreviewKeydown);
        
        // Add new listeners
        el.addEventListener('focus', handlePreviewFocus);
        el.addEventListener('blur', handlePreviewBlur);
        el.addEventListener('input', handlePreviewInput);
        el.addEventListener('keydown', handlePreviewKeydown);
      });
    };

    // Setup editing after render
    setTimeout(setupInlineEditing, 0);
  }, [state]);

  const handlePreviewFocus = (e) => {
    e.target.classList.add('editing');
  };

  const handlePreviewBlur = (e) => {
    e.target.classList.remove('editing');
    const field = e.target.dataset.field;
    const value = e.target.textContent.trim();
    
    // Handle basic fields
    if (field && state.hasOwnProperty(field)) {
      handleInputChange(field, value);
    }
    
    // Handle experience fields
    if (field && field.startsWith('exp-')) {
      const parts = field.split('-');
      const fieldType = parts[1];
      const index = parseInt(parts[2]);
      
      if (state.experience[index]) {
        handleExperienceChange(index, fieldType, value);
      }
    }
    
    // Handle education fields
    if (field && field.startsWith('edu-')) {
      const parts = field.split('-');
      const fieldType = parts[1];
      const index = parseInt(parts[2]);
      
      if (state.education[index]) {
        handleEducationChange(index, fieldType, value);
      }
    }
  };

  const handlePreviewInput = (e) => {
    // Don't update state during typing to prevent re-renders
    // State will be updated on blur instead
  };

  const handlePreviewKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // Check if we're in a bullet list (experience bullets or education details)
      const field = e.target.dataset.field;
      
      if (field && (field.startsWith('exp-bullets-') || field.startsWith('edu-details-'))) {
        try {
          // Get current selection
          const selection = window.getSelection();
          let cursorPos = 0;
          
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            cursorPos = range.startOffset;
          } else {
            // Fallback: put cursor at end
            cursorPos = e.target.textContent.length;
          }
          
          // Get the current text content
          const currentText = e.target.textContent;
          
          // Split text at cursor position
          const beforeCursor = currentText.substring(0, cursorPos);
          const afterCursor = currentText.substring(cursorPos);
          
          // Create new text with bullet point
          const newText = beforeCursor + '\n• ' + afterCursor;
          
          // Update the content
          e.target.textContent = newText;
          
          // Update state
          if (field.startsWith('exp-bullets-')) {
            const index = parseInt(field.split('-')[2]);
            handleExperienceChange(index, 'bullets', newText);
          } else if (field.startsWith('edu-details-')) {
            const index = parseInt(field.split('-')[2]);
            handleEducationChange(index, 'details', newText);
          }
          
          // Set cursor position after the new bullet point
          setTimeout(() => {
            try {
              const newCursorPos = beforeCursor.length + 3; // +3 for '\n• '
              const newRange = document.createRange();
              const textNode = e.target.firstChild || e.target;
              newRange.setStart(textNode, Math.min(newCursorPos, textNode.length));
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
            } catch (cursorError) {
              console.log('Cursor positioning failed, but bullet was added');
            }
          }, 0);
        } catch (error) {
          console.error('Error adding bullet point:', error);
          // Fallback: just add bullet at end
          const currentText = e.target.textContent;
          const newText = currentText + '\n• ';
          e.target.textContent = newText;
          
          if (field.startsWith('exp-bullets-')) {
            const index = parseInt(field.split('-')[2]);
            handleExperienceChange(index, 'bullets', newText);
          } else if (field.startsWith('edu-details-')) {
            const index = parseInt(field.split('-')[2]);
            handleEducationChange(index, 'details', newText);
          }
        }
      } else {
        // For other fields, just blur
        e.target.blur();
      }
    }
  };

  // Render resume preview
  const renderResume = () => {
    const contactBits = [state.email, state.phone, state.location, state.website, state.linkedin, state.github]
      .filter(Boolean).map(x => `<span>${esc(x)}</span>`).join(' · ');
    const skills = commaList(state.skills).map(s => `<span>${esc(s)}</span>`).join(' · ');

    const expHtml = state.experience.map((e, i) => `
      <div class="section">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px">
          <div><strong class="editable" data-field="exp-role-${i}" contenteditable="true" spellcheck="true">${esc(e.role || '')}</strong> · <span class="editable" data-field="exp-company-${i}" contenteditable="true" spellcheck="true">${esc(e.company || '')}</span></div>
          <div class="muted small editable" data-field="exp-dates-${i}" contenteditable="true" spellcheck="true">${esc(e.dates || '')}</div>
        </div>
        <div class="muted small editable" data-field="exp-place-${i}" contenteditable="true" spellcheck="true">${esc(e.place || '')}</div>
        ${(e.desc || '').trim() ? `<div class="small editable" style="margin-top:6px" data-field="exp-desc-${i}" contenteditable="true" spellcheck="true">${nl2br(e.desc)}</div>` : ''}
        ${(e.bullets || '').trim() ? `<div class="editable" data-field="exp-bullets-${i}" contenteditable="true" spellcheck="true" style="white-space:pre-wrap;">${formatBullets(e.bullets)}</div>` : `<div class="editable" data-field="exp-bullets-${i}" contenteditable="true" spellcheck="true" style="min-height:20px;white-space:pre-wrap;"></div>`}
      </div>
    `).join('');

    const eduHtml = state.education.map((e, i) => `
      <div class="section">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px">
          <div><strong class="editable" data-field="edu-degree-${i}" contenteditable="true" spellcheck="true">${esc(e.degree || '')}</strong> · <span class="editable" data-field="edu-school-${i}" contenteditable="true" spellcheck="true">${esc(e.school || '')}</span></div>
          <div class="muted small editable" data-field="edu-year-${i}" contenteditable="true" spellcheck="true">${esc(e.year || '')}</div>
        </div>
        <div class="muted small editable" data-field="edu-place-${i}" contenteditable="true" spellcheck="true">${esc(e.place || '')}</div>
        ${(e.details || '').trim() ? `<div class="editable" data-field="edu-details-${i}" contenteditable="true" spellcheck="true" style="white-space:pre-wrap;">${formatBullets(e.details)}</div>` : `<div class="editable" data-field="edu-details-${i}" contenteditable="true" spellcheck="true" style="min-height:20px;white-space:pre-wrap;"></div>`}
      </div>
    `).join('');

    const isEmpty = !state.name && !state.headline && !state.summary && !state.skills && 
                   state.experience.length === 0 && state.education.length === 0;

    if (isEmpty) {
      return `
        <div style="text-align:center;padding:60px 20px;color:#6b7280;">
          <h2 style="margin-bottom:20px;color:#374151;">Welcome to Resume Builder</h2>
          <p style="margin-bottom:30px;font-size:16px;line-height:1.6;">
            Click on any section in the editor to start building your resume.
          </p>
        </div>
      `;
    }

    return `
      <header>
        <div class="name editable" data-field="name" contenteditable="true" spellcheck="true">${esc(state.name || '')}</div>
        <div class="role editable" data-field="headline" contenteditable="true" spellcheck="true">${esc(state.headline || '')}</div>
        <div class="contact">${contactBits || ''}</div>
      </header>
      <div class="section">
        <h3>Summary</h3>
        <div class="summary editable" data-field="summary" contenteditable="true" spellcheck="true">${esc(state.summary || '')}</div>
      </div>
      <div class="section skills-section">
        <h3>Skills</h3>
        <div class="editable" data-field="skills" contenteditable="true" spellcheck="true">${skills || ''}</div>
      </div>
      <div class="section experience-section">
        <h3>Experience</h3>
        ${expHtml || '<div class="muted small">Add your roles.</div>'}
      </div>
      <div class="section education-section">
        <h3>Education</h3>
        ${eduHtml || '<div class="muted small">Add your education.</div>'}
      </div>
    `;
  };

  return (
    <div className={`resume-builder theme-${theme}`}>
      <div className="app">
                <header className="topbar">
          <div className="left">
            <strong>Ada's Resume Builder</strong>
            <button className="ghost" onClick={() => {
              if (window.confirm('Start a new blank resume?')) {
                setState({
                  name: "", headline: "",
                  email: "", phone: "", location: "",
                  website: "", linkedin: "", github: "",
                  summary: "",
                  skills: "",
                  experience: [],
                  education: [],
                  template: 'classic',
                  accent: '#2563eb',
                  fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
                  titleSize: 34,
                  headerSize: 13,
                  summarySize: 13,
                  skillsSize: 12,
                  experienceSize: 13,
                  educationSize: 13
                });
              }
            }}>New</button>
            <button className="ghost" onClick={saveJSON}>Save JSON</button>
            <button className="ghost" onClick={() => fileInputRef.current.click()}>Load JSON</button>
            <button className="ghost" onClick={() => window.open('https://www.reddit.com/r/jobs/comments/1eto8ia/heres_how_to_write_a_killer_resume_thats_gotten/', '_blank')}>Help</button>
            <input ref={fileInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => {
              loadJSONFiles(e.target.files);
              e.target.value = '';
            }} />
          </div>

          <div className="right">

            <button 
              className="ghost" 
              onClick={() => {
                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = state.accent;
                colorInput.onchange = (e) => handleInputChange('accent', e.target.value);
                colorInput.click();
              }}
              style={{ 
                color: state.accent,
                borderColor: state.accent,
                fontWeight: '500'
              }}
            >
              Accent
            </button>
            <button className="primary" onClick={exportPDF}>Export PDF</button>
            <button className="ghost" onClick={showDOCXInstructions}>DOCX</button>
            <button 
              className="ghost settings-btn"
              onClick={() => setShowSettings(!showSettings)}
              style={{ 
                fontSize: '16px',
                padding: '8px',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ⚙️
            </button>
          </div>
        </header>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settingsPanel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3>Settings</h3>
              <button 
                className="ghost" 
                onClick={() => setShowSettings(false)}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                ✕ Close
              </button>
            </div>
            <div className="settingsControls">
              <div>
                <label className="small">Theme
                  <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="high-contrast">High Contrast</option>
                  </select>
                </label>
              </div>
              <div>
                <label className="small">Typography
                  <button 
                    className="ghost" 
                    onClick={() => {
                      setShowTypography(!showTypography);
                      setShowSettings(false);
                    }}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    {showTypography ? 'Hide Typography' : 'Show Typography'}
                  </button>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Font Settings Panel */}
        {showTypography && (
          <div className="fontPanel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3>Typography Settings</h3>
              <button 
                className="ghost" 
                onClick={() => setShowTypography(false)}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                ✕ Hide
              </button>
            </div>
            <div className="fontControls">
              <div>
                <label className="small">Font Family
                  <select value={state.fontFamily} onChange={(e) => handleInputChange('fontFamily', e.target.value)}>
                    <option value="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">System Default</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, sans-serif">Helvetica</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                    <option value="Courier New, monospace">Courier New</option>
                    <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                    <option value="Impact, sans-serif">Impact</option>
                    <option value="Comic Sans MS, cursive">Comic Sans MS</option>
                    <option value="Segoe UI, Tahoma, Geneva, Verdana, sans-serif">Segoe UI (Windows)</option>
                    <option value="Tahoma, Geneva, Verdana, sans-serif">Tahoma</option>
                    <option value="Calibri, Candara, Segoe, Optima, Arial, sans-serif">Calibri</option>
                    <option value="Cambria, Georgia, serif">Cambria</option>
                    <option value="Consolas, Monaco, monospace">Consolas</option>
                    <option value="Candara, Calibri, Segoe, Optima, Arial, sans-serif">Candara</option>
                    <option value="Corbel, Arial, sans-serif">Corbel</option>
                    <option value="Constantia, Georgia, serif">Constantia</option>
                  </select>
                </label>
              </div>
              <div>
                <label className="small">Title Font Size <input type="range" min="24" max="48" value={state.titleSize} onChange={(e) => handleInputChange('titleSize', parseInt(e.target.value))} /></label>
                <span className="small">{state.titleSize}px</span>
              </div>
              <div>
                <label className="small">Header Font Size <input type="range" min="10" max="20" value={state.headerSize} onChange={(e) => handleInputChange('headerSize', parseInt(e.target.value))} /></label>
                <span className="small">{state.headerSize}px</span>
              </div>
              <div>
                <label className="small">Summary Font Size <input type="range" min="10" max="18" value={state.summarySize} onChange={(e) => handleInputChange('summarySize', parseInt(e.target.value))} /></label>
                <span className="small">{state.summarySize}px</span>
              </div>
              <div>
                <label className="small">Skills Font Size <input type="range" min="10" max="16" value={state.skillsSize} onChange={(e) => handleInputChange('skillsSize', parseInt(e.target.value))} /></label>
                <span className="small">{state.skillsSize}px</span>
              </div>
              <div>
                <label className="small">Experience Font Size <input type="range" min="10" max="16" value={state.experienceSize} onChange={(e) => handleInputChange('experienceSize', parseInt(e.target.value))} /></label>
                <span className="small">{state.experienceSize}px</span>
              </div>
              <div>
                <label className="small">Education Font Size <input type="range" min="10" max="16" value={state.educationSize} onChange={(e) => handleInputChange('educationSize', parseInt(e.target.value))} /></label>
                <span className="small">{state.educationSize}px</span>
              </div>
            </div>
          </div>
        )}

        {/* Editor */}
        <aside className="panel" id="editor">
          <h2>Header</h2>
          <label>Name<input value={state.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Your Name" /></label>
          <label>Headline / Role<input value={state.headline} onChange={(e) => handleInputChange('headline', e.target.value)} placeholder="Role / Headline" /></label>
          <div className="row">
            <label>Email<input value={state.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="you@example.com" /></label>
            <label>Phone<input value={state.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="(555) 123-4567" /></label>
          </div>
          <div className="row">
            <label>Location<input value={state.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="City, ST" /></label>
            <label>Website<input value={state.website} onChange={(e) => handleInputChange('website', e.target.value)} placeholder="https://yoursite.com" /></label>
          </div>
          <div className="row">
            <label>LinkedIn<input value={state.linkedin} onChange={(e) => handleInputChange('linkedin', e.target.value)} placeholder="linkedin.com/in/you" /></label>
            <label>GitHub<input value={state.github} onChange={(e) => handleInputChange('github', e.target.value)} placeholder="github.com/you" /></label>
          </div>

          <div className="sec">
            <h2>Summary</h2>
            <textarea value={state.summary} onChange={(e) => handleInputChange('summary', e.target.value)} placeholder="3–4 concise lines about your impact." />
          </div>

          <div className="sec">
            <h2>Skills (comma separated)</h2>
            <textarea value={state.skills} onChange={(e) => handleInputChange('skills', e.target.value)} placeholder="Python, SQL, Tableau, A/B Testing" />
          </div>

          <div className="sec" id="expSec">
            <h2>Experience</h2>
            <div id="expList">
              {state.experience.map((exp, index) => (
                <div key={index} className="item">
                  <div className="row">
                    <label>Role<input value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} /></label>
                    <label>Company<input value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} /></label>
                  </div>
                  <div className="row">
                    <label>Location<input value={exp.place} onChange={(e) => handleExperienceChange(index, 'place', e.target.value)} /></label>
                    <label>Dates<input value={exp.dates} onChange={(e) => handleExperienceChange(index, 'dates', e.target.value)} /></label>
                  </div>
                  <label>Description (optional)<textarea value={exp.desc} onChange={(e) => handleExperienceChange(index, 'desc', e.target.value)} /></label>
                  <label>Highlights (one per line)<textarea value={exp.bullets} onChange={(e) => handleExperienceChange(index, 'bullets', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'bullets', true)} /></label>
                  <div className="controls">
                    <button onClick={() => moveExperience(index, -1)}>↑</button>
                    <button onClick={() => moveExperience(index, 1)}>↓</button>
                    <button onClick={() => deleteExperience(index)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addExperience} style={{ marginTop: '10px', width: '100%' }}>+ Add Experience</button>
          </div>

          <div className="sec" id="eduSec">
            <h2>Education</h2>
            <div id="eduList">
              {state.education.map((edu, index) => (
                <div key={index} className="item">
                  <div className="row">
                    <label>Degree<input value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} /></label>
                    <label>School<input value={edu.school} onChange={(e) => handleEducationChange(index, 'school', e.target.value)} /></label>
                  </div>
                  <div className="row">
                    <label>Year / Dates<input value={edu.year} onChange={(e) => handleEducationChange(index, 'year', e.target.value)} /></label>
                    <label>Location<input value={edu.place} onChange={(e) => handleEducationChange(index, 'place', e.target.value)} /></label>
                  </div>
                  <label>Details (one per line)<textarea value={edu.details} onChange={(e) => handleEducationChange(index, 'details', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'details', false)} /></label>
                  <div className="controls">
                    <button onClick={() => moveEducation(index, -1)}>↑</button>
                    <button onClick={() => moveEducation(index, 1)}>↓</button>
                    <button onClick={() => deleteEducation(index)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addEducation} style={{ marginTop: '10px', width: '100%' }}>+ Add Education</button>
          </div>
        </aside>

        {/* Preview */}
        <main className="panel previewWrap">
          <div 
            id="paper" 
            className="paper" 
            style={{
              fontFamily: state.fontFamily,
              '--title-size': state.titleSize + 'px',
              '--header-size': state.headerSize + 'px',
              '--summary-size': state.summarySize + 'px',
              '--skills-size': state.skillsSize + 'px',
              '--experience-size': state.experienceSize + 'px',
              '--education-size': state.educationSize + 'px',
              '--accent': state.accent
            }}
            dangerouslySetInnerHTML={{ __html: renderResume() }}
          />
          <button 
            className="floating-typography-btn"
            onClick={() => setShowTypography(!showTypography)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 100,
              opacity: showTypography ? 0.7 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            Typography
          </button>
        </main>
      </div>
    </div>
  );
}

export default ResumeBuilder;
