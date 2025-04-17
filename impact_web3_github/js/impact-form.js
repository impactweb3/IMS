// Impact Data Form functionality for Impact Web3
// Handles form submission and data storage

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (window.ImpactAuth && typeof window.ImpactAuth.checkAuth === 'function') {
        if (!window.ImpactAuth.checkAuth()) {
            return; // Redirect handled by checkAuth function
        }
    }

    // Get the impact data form
    const impactDataForm = document.getElementById('impactDataForm');
    const saveAsDraftBtn = document.getElementById('saveAsDraft');
    
    // Initialize form with existing data if editing
    initializeForm();
    
    // Handle save as draft button
    if (saveAsDraftBtn) {
        saveAsDraftBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveFormData(true);
        });
    }
    
    // Handle form submission
    if (impactDataForm) {
        impactDataForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveFormData(false);
        });
    }
    
    // Function to initialize form with existing data if editing
    function initializeForm() {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('impactWeb3CurrentUser')) || null;
        
        if (!currentUser) {
            return;
        }
        
        // Check if we're editing an existing project
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        
        if (projectId) {
            // Find the project in the user's projects
            const project = currentUser.projects.find(p => p.id === projectId);
            
            if (project) {
                // Populate form fields with project data
                document.getElementById('projectName').value = project.projectName || '';
                document.getElementById('projectType').value = project.projectType || '';
                document.getElementById('blockchain').value = project.blockchain || '';
                document.getElementById('projectDescription').value = project.projectDescription || '';
                document.getElementById('projectWebsite').value = project.projectWebsite || '';
                document.getElementById('contractAddress').value = project.contractAddress || '';
                
                // Social impact metrics
                if (project.socialImpact) {
                    document.getElementById('beneficiaries').value = project.socialImpact.beneficiaries || '';
                    document.getElementById('communities').value = project.socialImpact.communities || '';
                    document.getElementById('socialImpactDescription').value = project.socialImpact.description || '';
                    
                    // Check SDG checkboxes
                    if (project.socialImpact.sdgs) {
                        project.socialImpact.sdgs.forEach(sdg => {
                            const checkbox = document.getElementById('sdg' + sdg);
                            if (checkbox) {
                                checkbox.checked = true;
                            }
                        });
                    }
                }
                
                // Environmental impact metrics
                if (project.environmentalImpact) {
                    document.getElementById('carbonOffset').value = project.environmentalImpact.carbonOffset || '';
                    document.getElementById('energyEfficiency').value = project.environmentalImpact.energyEfficiency || '';
                    document.getElementById('environmentalImpactDescription').value = project.environmentalImpact.description || '';
                    
                    // Check SDG checkboxes
                    if (project.environmentalImpact.sdgs) {
                        project.environmentalImpact.sdgs.forEach(sdg => {
                            const checkbox = document.getElementById('sdg' + sdg);
                            if (checkbox) {
                                checkbox.checked = true;
                            }
                        });
                    }
                }
                
                // Economic impact metrics
                if (project.economicImpact) {
                    document.getElementById('jobsCreated').value = project.economicImpact.jobsCreated || '';
                    document.getElementById('investmentGenerated').value = project.economicImpact.investmentGenerated || '';
                    document.getElementById('economicImpactDescription').value = project.economicImpact.description || '';
                    
                    // Check SDG checkboxes
                    if (project.economicImpact.sdgs) {
                        project.economicImpact.sdgs.forEach(sdg => {
                            const checkbox = document.getElementById('sdg' + sdg);
                            if (checkbox) {
                                checkbox.checked = true;
                            }
                        });
                    }
                }
                
                // Governance impact metrics
                if (project.governanceImpact) {
                    document.getElementById('participantsCount').value = project.governanceImpact.participantsCount || '';
                    document.getElementById('proposalsCount').value = project.governanceImpact.proposalsCount || '';
                    document.getElementById('governanceImpactDescription').value = project.governanceImpact.description || '';
                    
                    // Check SDG checkboxes
                    if (project.governanceImpact.sdgs) {
                        project.governanceImpact.sdgs.forEach(sdg => {
                            const checkbox = document.getElementById('sdg' + sdg);
                            if (checkbox) {
                                checkbox.checked = true;
                            }
                        });
                    }
                }
                
                // Verification information
                if (project.verification) {
                    document.getElementById('verificationMethod').value = project.verification.method || '';
                    document.getElementById('verificationDetails').value = project.verification.details || '';
                    document.getElementById('evidenceLinks').value = project.verification.evidenceLinks || '';
                }
            }
        }
    }
    
    // Function to save form data
    function saveFormData(isDraft) {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('impactWeb3CurrentUser')) || null;
        
        if (!currentUser) {
            showNotification('You must be logged in to submit impact data.', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(impactDataForm);
        
        // Check if we're editing an existing project
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id') || generateProjectId();
        
        // Create project object
        const project = {
            id: projectId,
            userId: currentUser.id,
            projectName: formData.get('projectName'),
            projectType: formData.get('projectType'),
            blockchain: formData.get('blockchain'),
            projectDescription: formData.get('projectDescription'),
            projectWebsite: formData.get('projectWebsite'),
            contractAddress: formData.get('contractAddress'),
            status: isDraft ? 'draft' : 'submitted',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            
            // Social impact metrics
            socialImpact: {
                beneficiaries: formData.get('socialImpact.beneficiaries') ? parseInt(formData.get('socialImpact.beneficiaries')) : null,
                communities: formData.get('socialImpact.communities') ? parseInt(formData.get('socialImpact.communities')) : null,
                description: formData.get('socialImpact.description'),
                sdgs: getSelectedCheckboxValues('socialImpact.sdgs')
            },
            
            // Environmental impact metrics
            environmentalImpact: {
                carbonOffset: formData.get('environmentalImpact.carbonOffset') ? parseFloat(formData.get('environmentalImpact.carbonOffset')) : null,
                energyEfficiency: formData.get('environmentalImpact.energyEfficiency') ? parseFloat(formData.get('environmentalImpact.energyEfficiency')) : null,
                description: formData.get('environmentalImpact.description'),
                sdgs: getSelectedCheckboxValues('environmentalImpact.sdgs')
            },
            
            // Economic impact metrics
            economicImpact: {
                jobsCreated: formData.get('economicImpact.jobsCreated') ? parseInt(formData.get('economicImpact.jobsCreated')) : null,
                investmentGenerated: formData.get('economicImpact.investmentGenerated') ? parseFloat(formData.get('economicImpact.investmentGenerated')) : null,
                description: formData.get('economicImpact.description'),
                sdgs: getSelectedCheckboxValues('economicImpact.sdgs')
            },
            
            // Governance impact metrics
            governanceImpact: {
                participantsCount: formData.get('governanceImpact.participantsCount') ? parseInt(formData.get('governanceImpact.participantsCount')) : null,
                proposalsCount: formData.get('governanceImpact.proposalsCount') ? parseInt(formData.get('governanceImpact.proposalsCount')) : null,
                description: formData.get('governanceImpact.description'),
                sdgs: getSelectedCheckboxValues('governanceImpact.sdgs')
            },
            
            // Verification information
            verification: {
                method: formData.get('verification.method'),
                details: formData.get('verification.details'),
                evidenceLinks: formData.get('verification.evidenceLinks')
            }
        };
        
        // Update user's projects
        if (!currentUser.projects) {
            currentUser.projects = [];
        }
        
        // Check if project already exists
        const existingProjectIndex = currentUser.projects.findIndex(p => p.id === projectId);
        
        if (existingProjectIndex !== -1) {
            // Update existing project
            currentUser.projects[existingProjectIndex] = project;
        } else {
            // Add new project
            currentUser.projects.push(project);
        }
        
        // Save updated user data
        localStorage.setItem('impactWeb3CurrentUser', JSON.stringify(currentUser));
        
        // Update users array
        let users = JSON.parse(localStorage.getItem('impactWeb3Users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('impactWeb3Users', JSON.stringify(users));
        }
        
        // Also save to global projects for the dashboard
        let allProjects = JSON.parse(localStorage.getItem('impactWeb3Projects')) || [];
        const existingGlobalProjectIndex = allProjects.findIndex(p => p.id === projectId);
        
        if (existingGlobalProjectIndex !== -1) {
            // Update existing project
            allProjects[existingGlobalProjectIndex] = project;
        } else {
            // Add new project
            allProjects.push(project);
        }
        
        localStorage.setItem('impactWeb3Projects', JSON.stringify(allProjects));
        
        // Show success notification
        if (isDraft) {
            showNotification('Project saved as draft successfully.');
        } else {
            showNotification('Impact data submitted successfully! It will be reviewed and published to the dashboard.');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    }
    
    // Helper function to get selected checkbox values
    function getSelectedCheckboxValues(name) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    // Helper function to generate a unique project ID
    function generateProjectId() {
        return 'project_' + Math.random().toString(36).substr(2, 9);
    }
});

// Show notification if not defined in auth.js
if (typeof showNotification !== 'function') {
    function showNotification(message, type = 'success') {
        // Check if notification container exists, create if not
        let notificationContainer = document.getElementById('notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '9999';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : 
                                            type === 'error' ? '#F44336' : 
                                            '#2196F3'; // info
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        notification.textContent = message;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, 3000);
    }
}
