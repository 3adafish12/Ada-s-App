import React, { useState, useEffect } from 'react';
import './Hobbies.css';

function Hobbies() {
  // Load hobbies from localStorage on component mount
  const [hobbies, setHobbies] = useState(() => {
    const savedHobbies = localStorage.getItem('hobbies');
    return savedHobbies ? JSON.parse(savedHobbies) : [];
  });
  
  const [selectedHobby, setSelectedHobby] = useState(null);
  const [isAddingHobby, setIsAddingHobby] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showReminder, setShowReminder] = useState(false);
  const [newHobby, setNewHobby] = useState({
    name: '',
    blocks: [],
    isActive: true,
    createdAt: null
  });

  // Save hobbies to localStorage whenever hobbies state changes
  useEffect(() => {
    localStorage.setItem('hobbies', JSON.stringify(hobbies));
  }, [hobbies]);

  // Block templates
  const blockTemplates = [
    { type: 'text', title: 'Description', placeholder: 'Tell us about this hobby...' },
    { type: 'text', title: 'How I Started', placeholder: 'How did you get into this hobby?' },
    { type: 'text', title: 'Accomplishments', placeholder: 'What have you achieved?' },
    { type: 'text', title: 'Memorable Stories', placeholder: 'Share some memorable experiences...' },
    { type: 'text', title: 'Current Status', placeholder: 'Where are you now with this hobby?' },
    { type: 'text', title: 'Future Plans', placeholder: 'What do you plan to do next?' },
    { type: 'photos', title: 'Photos', placeholder: 'Add photos of your hobby' },
    { type: 'custom', title: 'Custom Question', placeholder: 'Ask your own question...' }
  ];

  const addBlock = (template) => {
    const newBlock = {
      id: Date.now() + Math.random(),
      type: template.type,
      title: template.title,
      content: '',
      photos: template.type === 'photos' ? [] : null,
      isCustom: template.type === 'custom'
    };
    
    setNewHobby({
      ...newHobby,
      blocks: [...newHobby.blocks, newBlock]
    });
  };

  const updateBlock = (blockId, updates) => {
    setNewHobby({
      ...newHobby,
      blocks: newHobby.blocks.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      )
    });
  };

  const removeBlock = (blockId) => {
    setNewHobby({
      ...newHobby,
      blocks: newHobby.blocks.filter(block => block.id !== blockId)
    });
  };

  const handlePhotoUpload = (blockId, e) => {
    const files = Array.from(e.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    
    updateBlock(blockId, {
      photos: [...(newHobby.blocks.find(b => b.id === blockId)?.photos || []), ...photoUrls]
    });
  };

  const removePhoto = (blockId, photoIndex) => {
    const block = newHobby.blocks.find(b => b.id === blockId);
    const updatedPhotos = block.photos.filter((_, i) => i !== photoIndex);
    updateBlock(blockId, { photos: updatedPhotos });
  };

  const handleAddHobby = () => {
    setErrorMessage('');
    setShowReminder(false);
    
    if (!newHobby.name.trim()) {
      setErrorMessage('Please enter a hobby name to save your hobby.');
      setShowReminder(true);
      return;
    }
    
    if (newHobby.blocks.length === 0) {
      setErrorMessage('Add at least one content block to make your hobby more interesting!');
      setShowReminder(true);
      return;
    }
    
    // Check if blocks have content
    const emptyBlocks = newHobby.blocks.filter(block => 
      block.type === 'text' && !block.content.trim() && !block.isCustom
    );
    
    if (emptyBlocks.length > 0) {
      setErrorMessage('Please fill in all your content blocks before saving.');
      setShowReminder(true);
      return;
    }
    
    const hobbyWithId = {
      ...newHobby,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setHobbies([...hobbies, hobbyWithId]);
    resetForm();
    setIsAddingHobby(false);
    setErrorMessage('');
    setShowReminder(false);
  };

  const handleEditHobby = () => {
    setErrorMessage('');
    setShowReminder(false);
    
    if (!newHobby.name.trim()) {
      setErrorMessage('Please enter a hobby name to save your changes.');
      setShowReminder(true);
      return;
    }
    
    if (newHobby.blocks.length === 0) {
      setErrorMessage('Add at least one content block to make your hobby more interesting!');
      setShowReminder(true);
      return;
    }
    
    // Check if blocks have content
    const emptyBlocks = newHobby.blocks.filter(block => 
      block.type === 'text' && !block.content.trim() && !block.isCustom
    );
    
    if (emptyBlocks.length > 0) {
      setErrorMessage('Please fill in all your content blocks before saving.');
      setShowReminder(true);
      return;
    }
    
    const updatedHobbies = hobbies.map(hobby => 
      hobby.id === selectedHobby.id ? { ...newHobby, id: hobby.id, createdAt: hobby.createdAt } : hobby
    );
    setHobbies(updatedHobbies);
    setSelectedHobby({ ...newHobby, id: selectedHobby.id, createdAt: selectedHobby.createdAt });
    setIsEditing(false);
    setIsViewMode(true);
    setErrorMessage('');
    setShowReminder(false);
  };

  const handleDeleteHobby = (hobbyId) => {
    setHobbies(hobbies.filter(hobby => hobby.id !== hobbyId));
    if (selectedHobby && selectedHobby.id === hobbyId) {
      setSelectedHobby(null);
      setIsViewMode(false);
    }
  };

  const selectHobbyForEdit = (hobby) => {
    setSelectedHobby(hobby);
    setNewHobby(hobby);
    setIsEditing(true);
    setIsViewMode(false);
  };

  const selectHobbyForView = (hobby) => {
    setSelectedHobby(hobby);
    setIsEditing(false);
    setIsViewMode(true);
  };

  const resetForm = () => {
    setNewHobby({
      name: '',
      blocks: [],
      isActive: true,
      createdAt: null
    });
    setErrorMessage('');
    setShowReminder(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsAddingHobby(false);
    setIsViewMode(false);
    resetForm();
  };

  const startNewHobby = () => {
    setIsAddingHobby(true);
    setIsEditing(false);
    setIsViewMode(false);
    resetForm();
  };

  return (
    <div className="hobbies-page">
      {/* Left Panel - Hobbies List (only show if hobbies exist) */}
      {hobbies.length > 0 && (
        <div className="hobbies-sidebar">
          <div className="sidebar-header">
            <h2>My Hobbies</h2>
            <button className="add-hobby-btn" onClick={startNewHobby}>
              + New
            </button>
          </div>
          
          <div className="hobbies-list">
            {hobbies.map(hobby => (
              <div 
                key={hobby.id} 
                className={`hobby-item ${selectedHobby?.id === hobby.id ? 'selected' : ''}`}
                onClick={() => selectHobbyForView(hobby)}
              >
                <div className="hobby-item-header">
                  <h3>{hobby.name}</h3>
                  <span className={`status ${hobby.isActive ? 'active' : 'inactive'}`}>
                    {hobby.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="hobby-item-actions">
                  <button 
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectHobbyForEdit(hobby);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHobby(hobby.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right Panel - Content Area */}
      <div className="hobbies-content">
        {isAddingHobby && (
          <div className="editor-container">
            <div className="editor-header">
              <input
                type="text"
                className="hobby-title-input"
                placeholder="Enter hobby name..."
                value={newHobby.name}
                onChange={(e) => setNewHobby({...newHobby, name: e.target.value})}
              />
              <div className="editor-actions">
                <button className="save-btn" onClick={handleAddHobby}>
                  Save Hobby
                </button>
                <button className="cancel-btn" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
            
            {showReminder && errorMessage && (
              <div className="error-reminder">
                <div className="error-icon">⚠️</div>
                <div className="error-content">
                  <h4>Save Reminder</h4>
                  <p>{errorMessage}</p>
                </div>
                <button className="dismiss-error" onClick={() => setShowReminder(false)}>
                  ×
                </button>
              </div>
            )}
            
            <div className="block-selector">
              <h3>Add Content Blocks</h3>
              <div className="block-templates">
                {blockTemplates.map((template, index) => (
                  <button
                    key={index}
                    className="block-template-btn"
                    onClick={() => addBlock(template)}
                  >
                    + {template.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="blocks-container">
              {newHobby.blocks.map((block, index) => (
                <div key={block.id} className="content-block">
                  <div className="block-header">
                    <input
                      type="text"
                      className="block-title"
                      value={block.title}
                      onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                      placeholder="Block title..."
                    />
                    <button 
                      className="remove-block-btn"
                      onClick={() => removeBlock(block.id)}
                    >
                      ×
                    </button>
                  </div>
                  
                  {block.type === 'text' && (
                    <>
                      {block.isCustom && (
                        <div className="custom-question-input">
                          <label htmlFor={`custom-question-${block.id}`}>Custom Question:</label>
                          <input
                            id={`custom-question-${block.id}`}
                            type="text"
                            className="custom-question-field"
                            value={block.title}
                            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                            placeholder="Enter your custom question here..."
                          />
                        </div>
                      )}
                      <textarea
                        className="block-content"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder={block.isCustom ? "Write your answer here..." : "Write your content here..."}
                        rows="4"
                      />
                    </>
                  )}
                  
                  {block.type === 'photos' && (
                    <div className="photo-block">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(block.id, e)}
                        className="photo-upload"
                      />
                      {block.photos && block.photos.length > 0 && (
                        <div className="photo-preview">
                          {block.photos.map((photo, photoIndex) => (
                            <div key={photoIndex} className="photo-item">
                              <img src={photo} alt={`Photo ${photoIndex + 1}`} />
                              <button 
                                className="remove-photo-btn"
                                onClick={() => removePhoto(block.id, photoIndex)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isEditing && selectedHobby && (
          <div className="editor-container">
            <div className="editor-header">
              <input
                type="text"
                className="hobby-title-input"
                value={newHobby.name}
                onChange={(e) => setNewHobby({...newHobby, name: e.target.value})}
              />
              <div className="editor-actions">
                <button className="save-btn" onClick={handleEditHobby}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
            
            {showReminder && errorMessage && (
              <div className="error-reminder">
                <div className="error-icon">⚠️</div>
                <div className="error-content">
                  <h4>Save Reminder</h4>
                  <p>{errorMessage}</p>
                </div>
                <button className="dismiss-error" onClick={() => setShowReminder(false)}>
                  ×
                </button>
              </div>
            )}
            
            <div className="block-selector">
              <h3>Add Content Blocks</h3>
              <div className="block-templates">
                {blockTemplates.map((template, index) => (
                  <button
                    key={index}
                    className="block-template-btn"
                    onClick={() => addBlock(template)}
                  >
                    + {template.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="blocks-container">
              {newHobby.blocks.map((block, index) => (
                <div key={block.id} className="content-block">
                  <div className="block-header">
                    <input
                      type="text"
                      className="block-title"
                      value={block.title}
                      onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                    />
                    <button 
                      className="remove-block-btn"
                      onClick={() => removeBlock(block.id)}
                    >
                      ×
                    </button>
                  </div>
                  
                  {block.type === 'text' && (
                    <>
                      {block.isCustom && (
                        <div className="custom-question-input">
                          <label htmlFor={`custom-question-edit-${block.id}`}>Custom Question:</label>
                          <input
                            id={`custom-question-edit-${block.id}`}
                            type="text"
                            className="custom-question-field"
                            value={block.title}
                            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                            placeholder="Enter your custom question here..."
                          />
                        </div>
                      )}
                      <textarea
                        className="block-content"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder={block.isCustom ? "Write your answer here..." : "Write your content here..."}
                        rows="4"
                      />
                    </>
                  )}
                  
                  {block.type === 'photos' && (
                    <div className="photo-block">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(block.id, e)}
                        className="photo-upload"
                      />
                      {block.photos && block.photos.length > 0 && (
                        <div className="photo-preview">
                          {block.photos.map((photo, photoIndex) => (
                            <div key={photoIndex} className="photo-item">
                              <img src={photo} alt={`Photo ${photoIndex + 1}`} />
                              <button 
                                className="remove-photo-btn"
                                onClick={() => removePhoto(block.id, photoIndex)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isViewMode && selectedHobby && (
          <div className="blog-view">
            <div className="blog-header">
              <h1>{selectedHobby.name}</h1>
              <div className="blog-meta">
                <span className={`status ${selectedHobby.isActive ? 'active' : 'inactive'}`}>
                  {selectedHobby.isActive ? 'Active' : 'Inactive'}
                </span>
                {selectedHobby.createdAt && (
                  <span className="created-date">
                    Created: {new Date(selectedHobby.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <button 
                className="edit-btn"
                onClick={() => selectHobbyForEdit(selectedHobby)}
              >
                Edit Hobby
              </button>
            </div>
            
            <div className="blog-content">
              {selectedHobby.blocks.map((block, index) => (
                <div key={block.id} className="blog-block">
                  <h2 className="blog-section-title">{block.title}</h2>
                  
                  {block.type === 'text' && block.content && (
                    <div className="blog-text">
                      {block.content.split('\n').map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  
                  {block.type === 'photos' && block.photos && block.photos.length > 0 && (
                    <div className="blog-photos">
                      {block.photos.map((photo, photoIndex) => (
                        <img 
                          key={photoIndex} 
                          src={photo} 
                          alt={`${selectedHobby.name} - ${block.title}`}
                          className="blog-photo"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!selectedHobby && !isAddingHobby && !isEditing && hobbies.length === 0 && (
          <div className="empty-content">
            <h2>Welcome to Your Hobbies</h2>
            <p>Start documenting your hobbies and interests!</p>
            <button className="start-btn" onClick={startNewHobby}>
              Create Your First Hobby
            </button>
          </div>
        )}
        
        {!selectedHobby && !isAddingHobby && !isEditing && hobbies.length > 0 && (
          <div className="empty-content">
            <h2>Select a Hobby</h2>
            <p>Choose a hobby from the sidebar to view its details, or create a new one!</p>
            <button className="start-btn" onClick={startNewHobby}>
              Create New Hobby
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hobbies; 