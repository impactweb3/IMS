// Dashboard functionality for Impact Web3
// Handles data visualization and interaction

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the auth system UI
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }

    // Get dashboard elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const blockchainFilter = document.getElementById('blockchainFilter');
    const projectTypeFilter = document.getElementById('projectTypeFilter');
    const timeRangeFilter = document.getElementById('timeRangeFilter');
    
    // Get project data from localStorage
    let allProjects = JSON.parse(localStorage.getItem('impactWeb3Projects')) || [];
    
    // If no projects exist, create some sample data
    if (allProjects.length === 0) {
        createSampleData();
        allProjects = JSON.parse(localStorage.getItem('impactWeb3Projects')) || [];
    }
    
    // Initialize dashboard
    initializeDashboard();
    
    // Handle tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Refresh charts for the active tab
            refreshCharts(tabId);
        });
    });
    
    // Handle filters
    blockchainFilter.addEventListener('change', applyFilters);
    projectTypeFilter.addEventListener('change', applyFilters);
    timeRangeFilter.addEventListener('change', applyFilters);
    
    // Initialize dashboard with data
    function initializeDashboard() {
        // Apply initial filters
        applyFilters();
        
        // Initialize charts
        initializeCharts();
        
        // Populate tables
        populateRecentProjectsTable();
        populateMyProjectsTable();
    }
    
    // Apply filters to dashboard data
    function applyFilters() {
        const blockchain = blockchainFilter.value;
        const projectType = projectTypeFilter.value;
        const timeRange = timeRangeFilter.value;
        
        // Filter projects based on selected criteria
        let filteredProjects = allProjects;
        
        if (blockchain !== 'all') {
            filteredProjects = filteredProjects.filter(project => project.blockchain === blockchain);
        }
        
        if (projectType !== 'all') {
            filteredProjects = filteredProjects.filter(project => project.projectType === projectType);
        }
        
        if (timeRange !== 'all') {
            const now = new Date();
            let cutoffDate;
            
            switch (timeRange) {
                case 'year':
                    cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    break;
                case 'quarter':
                    cutoffDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                    break;
                case 'month':
                    cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    break;
                default:
                    cutoffDate = new Date(0); // Beginning of time
            }
            
            filteredProjects = filteredProjects.filter(project => new Date(project.createdAt) >= cutoffDate);
        }
        
        // Update dashboard with filtered data
        updateDashboardMetrics(filteredProjects);
        updateCharts(filteredProjects);
        populateRecentProjectsTable(filteredProjects);
    }
    
    // Update dashboard metrics based on filtered projects
    function updateDashboardMetrics(projects) {
        // Overview metrics
        document.getElementById('totalProjects').textContent = projects.length;
        
        // Calculate total beneficiaries
        const totalBeneficiaries = projects.reduce((sum, project) => {
            return sum + (project.socialImpact?.beneficiaries || 0);
        }, 0);
        document.getElementById('totalBeneficiaries').textContent = formatNumber(totalBeneficiaries);
        
        // Calculate total carbon offset
        const totalCarbonOffset = projects.reduce((sum, project) => {
            return sum + (project.environmentalImpact?.carbonOffset || 0);
        }, 0);
        document.getElementById('totalCarbonOffset').textContent = formatNumber(totalCarbonOffset);
        
        // Calculate total jobs created
        const totalJobs = projects.reduce((sum, project) => {
            return sum + (project.economicImpact?.jobsCreated || 0);
        }, 0);
        document.getElementById('totalJobs').textContent = formatNumber(totalJobs);
        
        // Set placeholder change percentages (in a real app, these would be calculated)
        document.getElementById('projectsChange').textContent = '12%';
        document.getElementById('beneficiariesChange').textContent = '8%';
        document.getElementById('carbonOffsetChange').textContent = '15%';
        document.getElementById('jobsChange').textContent = '10%';
        
        // Social impact metrics
        document.getElementById('socialBeneficiaries').textContent = formatNumber(totalBeneficiaries);
        
        const totalCommunities = projects.reduce((sum, project) => {
            return sum + (project.socialImpact?.communities || 0);
        }, 0);
        document.getElementById('socialCommunities').textContent = formatNumber(totalCommunities);
        
        const socialProjects = projects.filter(project => 
            project.socialImpact?.beneficiaries > 0 || 
            project.socialImpact?.communities > 0 ||
            (project.socialImpact?.sdgs && project.socialImpact.sdgs.length > 0)
        ).length;
        document.getElementById('socialProjects').textContent = socialProjects;
        
        // Find top social SDG
        const socialSDGs = {};
        projects.forEach(project => {
            if (project.socialImpact?.sdgs) {
                project.socialImpact.sdgs.forEach(sdg => {
                    socialSDGs[sdg] = (socialSDGs[sdg] || 0) + 1;
                });
            }
        });
        const topSocialSDG = Object.keys(socialSDGs).reduce((a, b) => socialSDGs[a] > socialSDGs[b] ? a : b, '');
        document.getElementById('topSocialSDG').textContent = topSocialSDG ? `SDG ${topSocialSDG}` : '-';
        
        // Environmental impact metrics
        document.getElementById('envCarbonOffset').textContent = formatNumber(totalCarbonOffset);
        
        const avgEnergyEfficiency = projects.reduce((sum, project) => {
            return sum + (project.environmentalImpact?.energyEfficiency || 0);
        }, 0) / (projects.filter(p => p.environmentalImpact?.energyEfficiency > 0).length || 1);
        document.getElementById('envEnergyEfficiency').textContent = formatNumber(avgEnergyEfficiency) + '%';
        
        const envProjects = projects.filter(project => 
            project.environmentalImpact?.carbonOffset > 0 || 
            project.environmentalImpact?.energyEfficiency > 0 ||
            (project.environmentalImpact?.sdgs && project.environmentalImpact.sdgs.length > 0)
        ).length;
        document.getElementById('envProjects').textContent = envProjects;
        
        // Find top environmental SDG
        const envSDGs = {};
        projects.forEach(project => {
            if (project.environmentalImpact?.sdgs) {
                project.environmentalImpact.sdgs.forEach(sdg => {
                    envSDGs[sdg] = (envSDGs[sdg] || 0) + 1;
                });
            }
        });
        const topEnvSDG = Object.keys(envSDGs).reduce((a, b) => envSDGs[a] > envSDGs[b] ? a : b, '');
        document.getElementById('topEnvSDG').textContent = topEnvSDG ? `SDG ${topEnvSDG}` : '-';
        
        // Economic impact metrics
        document.getElementById('econJobs').textContent = formatNumber(totalJobs);
        
        const totalInvestment = projects.reduce((sum, project) => {
            return sum + (project.economicImpact?.investmentGenerated || 0);
        }, 0);
        document.getElementById('econInvestment').textContent = '$' + formatNumber(totalInvestment);
        
        const econProjects = projects.filter(project => 
            project.economicImpact?.jobsCreated > 0 || 
            project.economicImpact?.investmentGenerated > 0 ||
            (project.economicImpact?.sdgs && project.economicImpact.sdgs.length > 0)
        ).length;
        document.getElementById('econProjects').textContent = econProjects;
        
        // Find top economic SDG
        const econSDGs = {};
        projects.forEach(project => {
            if (project.economicImpact?.sdgs) {
                project.economicImpact.sdgs.forEach(sdg => {
                    econSDGs[sdg] = (econSDGs[sdg] || 0) + 1;
                });
            }
        });
        const topEconSDG = Object.keys(econSDGs).reduce((a, b) => econSDGs[a] > econSDGs[b] ? a : b, '');
        document.getElementById('topEconSDG').textContent = topEconSDG ? `SDG ${topEconSDG}` : '-';
        
        // Governance impact metrics
        const totalParticipants = projects.reduce((sum, project) => {
            return sum + (project.governanceImpact?.participantsCount || 0);
        }, 0);
        document.getElementById('govParticipants').textContent = formatNumber(totalParticipants);
        
        const totalProposals = projects.reduce((sum, project) => {
            return sum + (project.governanceImpact?.proposalsCount || 0);
        }, 0);
        document.getElementById('govProposals').textContent = formatNumber(totalProposals);
        
        const govProjects = projects.filter(project => 
            project.governanceImpact?.participantsCount > 0 || 
            project.governanceImpact?.proposalsCount > 0 ||
            (project.governanceImpact?.sdgs && project.governanceImpact.sdgs.length > 0)
        ).length;
        document.getElementById('govProjects').textContent = govProjects;
        
        // Find top governance SDG
        const govSDGs = {};
        projects.forEach(project => {
            if (project.governanceImpact?.sdgs) {
                project.governanceImpact.sdgs.forEach(sdg => {
                    govSDGs[sdg] = (govSDGs[sdg] || 0) + 1;
                });
            }
        });
        const topGovSDG = Object.keys(govSDGs).reduce((a, b) => govSDGs[a] > govSDGs[b] ? a : b, '');
        document.getElementById('topGovSDG').textContent = topGovSDG ? `SDG ${topGovSDG}` : '-';
    }
    
    // Initialize charts
    function initializeCharts() {
        // Impact Distribution Chart
        const impactDistributionCtx = document.getElementById('impactDistributionChart').getContext('2d');
        window.impactDistributionChart = new Chart(impactDistributionCtx, {
            type: 'pie',
            data: {
                labels: ['Social', 'Environmental', 'Economic', 'Governance'],
                datasets: [{
                    data: [25, 25, 25, 25], // Placeholder data
                    backgroundColor: [
                        '#4361ee',
                        '#38b000',
                        '#ffbe0b',
                        '#7209b7'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
        
        // Impact Trends Chart
        const impactTrendsCtx = document.getElementById('impactTrendsChart').getContext('2d');
        window.impactTrendsChart = new Chart(impactTrendsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Social Impact',
                        data: [12, 19, 3, 5, 2, 3],
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Environmental Impact',
                        data: [5, 10, 15, 12, 20, 25],
                        borderColor: '#38b000',
                        backgroundColor: 'rgba(56, 176, 0, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Economic Impact',
                        data: [8, 15, 12, 18, 22, 30],
                        borderColor: '#ffbe0b',
                        backgroundColor: 'rgba(255, 190, 11, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Governance Impact',
                        data: [3, 8, 12, 15, 18, 22],
                        borderColor: '#7209b7',
                        backgroundColor: 'rgba(114, 9, 183, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // SDG Contribution Chart
        const sdgContributionCtx = document.getElementById('sdgContributionChart').getContext('2d');
        window.sdgContributionChart = new Chart(sdgContributionCtx, {
            type: 'bar',
            data: {
                labels: ['SDG 1', 'SDG 2', 'SDG 3', 'SDG 4', 'SDG 5', 'SDG 6', 'SDG 7', 'SDG 8', 'SDG 9', 'SDG 10', 'SDG 11', 'SDG 12', 'SDG 13', 'SDG 14', 'SDG 15', 'SDG 16', 'SDG 17'],
                datasets: [{
                    label: 'Projects Contributing',
                    data: [12, 19, 3, 5, 2, 3, 10, 8, 15, 7, 9, 12, 14, 6, 8, 10, 5],
                    backgroundColor: [
                        '#e5243b', '#DDA63A', '#4C9F38', '#C5192D', '#FF3A21', '#26BDE2', '#FCC30B', 
                        '#A21942', '#FD6925', '#DD1367', '#FD9D24', '#BF8B2E', '#3F7E44', '#0A97D9', 
                        '#56C02B', '#00689D', '#19486A'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Initialize other charts for different tabs
        initializeSocialCharts();
        initializeEnvironmentalCharts();
        initializeEconomicCharts();
        initializeGovernanceCharts();
    }
    
    // Initialize social impact charts
    function initializeSocialCharts() {
        // Social Impact by Project Type Chart
        const socialImpactByTypeCtx = document.getElementById('socialImpactByTypeChart').getContext('2d');
        window.socialImpactByTypeChart = new Chart(socialImpactByTypeCtx, {
            type: 'bar',
            data: {
                labels: ['DeFi', 'NFT', 'DAO', 'Infrastructure', 'Social Impact', 'Environmental'],
                datasets: [{
                    label: 'Beneficiaries',
                    data: [1200, 1900, 300, 500, 2000, 300],
                    backgroundColor: '#4361ee'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Social SDG Chart
        const socialSDGCtx = document.getElementById('socialSDGChart').getContext('2d');
        window.socialSDGChart = new Chart(socialSDGCtx, {
            type: 'doughnut',
            data: {
                labels: ['SDG 1: No Poverty', 'SDG 2: Zero Hunger', 'SDG 3: Good Health', 'SDG 4: Quality Education', 'SDG 5: Gender Equality'],
                datasets: [{
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: [
                        '#e5243b', '#DDA63A', '#4C9F38', '#C5192D', '#FF3A21'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    // Initialize environmental impact charts
    function initializeEnvironmentalCharts() {
        // Carbon Offset by Blockchain Chart
        const carbonOffsetByChainCtx = document.getElementById('carbonOffsetByChainChart').getContext('2d');
        window.carbonOffsetByChainChart = new Chart(carbonOffsetByChainCtx, {
            type: 'bar',
            data: {
                labels: ['Cardano', 'Midnight', 'Ethereum', 'Polygon', 'Solana'],
                datasets: [{
                    label: 'Carbon Offset (tons)',
                    data: [1200, 1900, 300, 500, 200],
                    backgroundColor: '#38b000'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Environmental SDG Chart
        const environmentalSDGCtx = document.getElementById('environmentalSDGChart').getContext('2d');
        window.environmentalSDGChart = new Chart(environmentalSDGCtx, {
            type: 'doughnut',
            data: {
                labels: ['SDG 6: Clean Water', 'SDG 7: Clean Energy', 'SDG 12: Responsible Consumption', 'SDG 13: Climate Action', 'SDG 14: Life Below Water', 'SDG 15: Life on Land'],
                datasets: [{
                    data: [12, 19, 3, 5, 2, 8],
                    backgroundColor: [
                        '#26BDE2', '#FCC30B', '#BF8B2E', '#3F7E44', '#0A97D9', '#56C02B'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    // Initialize economic impact charts
    function initializeEconomicCharts() {
        // Investment by Project Type Chart
        const investmentByTypeCtx = document.getElementById('investmentByTypeChart').getContext('2d');
        window.investmentByTypeChart = new Chart(investmentByTypeCtx, {
            type: 'bar',
            data: {
                labels: ['DeFi', 'NFT', 'DAO', 'Infrastructure', 'Social Impact', 'Environmental'],
                datasets: [{
                    label: 'Investment (USD)',
                    data: [120000, 190000, 30000, 50000, 20000, 30000],
                    backgroundColor: '#ffbe0b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Economic SDG Chart
        const economicSDGCtx = document.getElementById('economicSDGChart').getContext('2d');
        window.economicSDGChart = new Chart(economicSDGCtx, {
            type: 'doughnut',
            data: {
                labels: ['SDG 8: Decent Work', 'SDG 9: Industry & Innovation', 'SDG 10: Reduced Inequalities', 'SDG 11: Sustainable Cities'],
                datasets: [{
                    data: [12, 19, 3, 5],
                    backgroundColor: [
                        '#A21942', '#FD6925', '#DD1367', '#FD9D24'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    // Initialize governance impact charts
    function initializeGovernanceCharts() {
        // Governance by Blockchain Chart
        const governanceByChainCtx = document.getElementById('governanceByChainChart').getContext('2d');
        window.governanceByChainChart = new Chart(governanceByChainCtx, {
            type: 'bar',
            data: {
                labels: ['Cardano', 'Midnight', 'Ethereum', 'Polygon', 'Solana'],
                datasets: [{
                    label: 'Governance Participants',
                    data: [1200, 1900, 300, 500, 200],
                    backgroundColor: '#7209b7'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Governance SDG Chart
        const governanceSDGCtx = document.getElementById('governanceSDGChart').getContext('2d');
        window.governanceSDGChart = new Chart(governanceSDGCtx, {
            type: 'doughnut',
            data: {
                labels: ['SDG 16: Peace & Justice', 'SDG 17: Partnerships for the Goals'],
                datasets: [{
                    data: [12, 19],
                    backgroundColor: [
                        '#00689D', '#19486A'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    // Update charts based on filtered data
    function updateCharts(projects) {
        // Update Impact Distribution Chart
        const socialCount = projects.filter(p => 
            p.socialImpact?.beneficiaries > 0 || 
            p.socialImpact?.communities > 0 ||
            (p.socialImpact?.sdgs && p.socialImpact.sdgs.length > 0)
        ).length;
        
        const envCount = projects.filter(p => 
            p.environmentalImpact?.carbonOffset > 0 || 
            p.environmentalImpact?.energyEfficiency > 0 ||
            (p.environmentalImpact?.sdgs && p.environmentalImpact.sdgs.length > 0)
        ).length;
        
        const econCount = projects.filter(p => 
            p.economicImpact?.jobsCreated > 0 || 
            p.economicImpact?.investmentGenerated > 0 ||
            (p.economicImpact?.sdgs && p.economicImpact.sdgs.length > 0)
        ).length;
        
        const govCount = projects.filter(p => 
            p.governanceImpact?.participantsCount > 0 || 
            p.governanceImpact?.proposalsCount > 0 ||
            (p.governanceImpact?.sdgs && p.governanceImpact.sdgs.length > 0)
        ).length;
        
        window.impactDistributionChart.data.datasets[0].data = [socialCount, envCount, econCount, govCount];
        window.impactDistributionChart.update();
        
        // Update SDG Contribution Chart
        const sdgCounts = {};
        for (let i = 1; i <= 17; i++) {
            sdgCounts[i] = 0;
        }
        
        projects.forEach(project => {
            // Count social SDGs
            if (project.socialImpact?.sdgs) {
                project.socialImpact.sdgs.forEach(sdg => {
                    sdgCounts[sdg] = (sdgCounts[sdg] || 0) + 1;
                });
            }
            
            // Count environmental SDGs
            if (project.environmentalImpact?.sdgs) {
                project.environmentalImpact.sdgs.forEach(sdg => {
                    sdgCounts[sdg] = (sdgCounts[sdg] || 0) + 1;
                });
            }
            
            // Count economic SDGs
            if (project.economicImpact?.sdgs) {
                project.economicImpact.sdgs.forEach(sdg => {
                    sdgCounts[sdg] = (sdgCounts[sdg] || 0) + 1;
                });
            }
            
            // Count governance SDGs
            if (project.governanceImpact?.sdgs) {
                project.governanceImpact.sdgs.forEach(sdg => {
                    sdgCounts[sdg] = (sdgCounts[sdg] || 0) + 1;
                });
            }
        });
        
        window.sdgContributionChart.data.datasets[0].data = Object.values(sdgCounts);
        window.sdgContributionChart.update();
        
        // Update other charts based on the active tab
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        refreshCharts(activeTab);
    }
    
    // Refresh charts for a specific tab
    function refreshCharts(tabId) {
        switch (tabId) {
            case 'social':
                updateSocialCharts();
                break;
            case 'environmental':
                updateEnvironmentalCharts();
                break;
            case 'economic':
                updateEconomicCharts();
                break;
            case 'governance':
                updateGovernanceCharts();
                break;
        }
    }
    
    // Update social impact charts
    function updateSocialCharts() {
        // In a real app, this would update the charts with actual data
        // For this demo, we'll just use placeholder data
        window.socialImpactByTypeChart.update();
        window.socialSDGChart.update();
    }
    
    // Update environmental impact charts
    function updateEnvironmentalCharts() {
        // In a real app, this would update the charts with actual data
        // For this demo, we'll just use placeholder data
        window.carbonOffsetByChainChart.update();
        window.environmentalSDGChart.update();
    }
    
    // Update economic impact charts
    function updateEconomicCharts() {
        // In a real app, this would update the charts with actual data
        // For this demo, we'll just use placeholder data
        window.investmentByTypeChart.update();
        window.economicSDGChart.update();
    }
    
    // Update governance impact charts
    function updateGovernanceCharts() {
        // In a real app, this would update the charts with actual data
        // For this demo, we'll just use placeholder data
        window.governanceByChainChart.update();
        window.governanceSDGChart.update();
    }
    
    // Populate recent projects table
    function populateRecentProjectsTable(projects = allProjects) {
        const tableBody = document.querySelector('#recentProjectsTable tbody');
        tableBody.innerHTML = '';
        
        // Sort projects by creation date (newest first)
        const sortedProjects = [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Take the 10 most recent projects
        const recentProjects = sortedProjects.slice(0, 10);
        
        if (recentProjects.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="8" style="text-align: center;">No projects found</td>`;
            tableBody.appendChild(row);
            return;
        }
        
        recentProjects.forEach(project => {
            const row = document.createElement('tr');
            
            // Calculate impact scores (simplified for demo)
            const socialScore = project.socialImpact?.beneficiaries ? '★★★' : (project.socialImpact?.sdgs?.length ? '★★' : '★');
            const envScore = project.environmentalImpact?.carbonOffset ? '★★★' : (project.environmentalImpact?.sdgs?.length ? '★★' : '★');
            const econScore = project.economicImpact?.jobsCreated ? '★★★' : (project.economicImpact?.sdgs?.length ? '★★' : '★');
            const govScore = project.governanceImpact?.participantsCount ? '★★★' : (project.governanceImpact?.sdgs?.length ? '★★' : '★');
            
            row.innerHTML = `
                <td>${project.projectName}</td>
                <td>${formatProjectType(project.projectType)}</td>
                <td>${formatBlockchain(project.blockchain)}</td>
                <td>${socialScore}</td>
                <td>${envScore}</td>
                <td>${econScore}</td>
                <td>${govScore}</td>
                <td>
                    <button class="view-details-btn" data-id="${project.id}">View Details</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to view details buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function() {
                const projectId = this.getAttribute('data-id');
                showProjectDetails(projectId);
            });
        });
    }
    
    // Populate my projects table
    function populateMyProjectsTable() {
        const tableBody = document.querySelector('#myProjectsTable tbody');
        tableBody.innerHTML = '';
        
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('impactWeb3CurrentUser'));
        
        if (!currentUser || !currentUser.projects || currentUser.projects.length === 0) {
            document.getElementById('noProjectsMessage').style.display = 'block';
            return;
        }
        
        document.getElementById('noProjectsMessage').style.display = 'none';
        
        // Sort projects by creation date (newest first)
        const sortedProjects = [...currentUser.projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        sortedProjects.forEach(project => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${project.projectName}</td>
                <td>${formatProjectType(project.projectType)}</td>
                <td>${formatBlockchain(project.blockchain)}</td>
                <td><span class="status-badge ${project.status}">${formatStatus(project.status)}</span></td>
                <td>${formatDate(project.createdAt)}</td>
                <td>${formatDate(project.updatedAt)}</td>
                <td>
                    <button class="edit-project-btn" data-id="${project.id}">Edit</button>
                    <button class="view-details-btn" data-id="${project.id}">View</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.edit-project-btn').forEach(button => {
            button.addEventListener('click', function() {
                const projectId = this.getAttribute('data-id');
                window.location.href = `impact-form.html?id=${projectId}`;
            });
        });
        
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function() {
                const projectId = this.getAttribute('data-id');
                showProjectDetails(projectId);
            });
        });
    }
    
    // Show project details in modal
    function showProjectDetails(projectId) {
        const project = allProjects.find(p => p.id === projectId);
        
        if (!project) {
            return;
        }
        
        const modal = document.getElementById('projectDetailsModal');
        const modalTitle = document.getElementById('projectDetailsTitle');
        const modalContent = document.getElementById('projectDetailsContent');
        
        modalTitle.textContent = project.projectName;
        
        modalContent.innerHTML = `
            <div class="project-details">
                <div class="project-section">
                    <h4>Project Information</h4>
                    <p><strong>Type:</strong> ${formatProjectType(project.projectType)}</p>
                    <p><strong>Blockchain:</strong> ${formatBlockchain(project.blockchain)}</p>
                    <p><strong>Description:</strong> ${project.projectDescription}</p>
                    ${project.projectWebsite ? `<p><strong>Website:</strong> <a href="${project.projectWebsite}" target="_blank">${project.projectWebsite}</a></p>` : ''}
                    ${project.contractAddress ? `<p><strong>Contract Address:</strong> ${project.contractAddress}</p>` : ''}
                </div>
                
                <div class="project-section">
                    <h4>Social Impact</h4>
                    ${project.socialImpact?.beneficiaries ? `<p><strong>Beneficiaries:</strong> ${formatNumber(project.socialImpact.beneficiaries)}</p>` : ''}
                    ${project.socialImpact?.communities ? `<p><strong>Communities Served:</strong> ${formatNumber(project.socialImpact.communities)}</p>` : ''}
                    ${project.socialImpact?.description ? `<p><strong>Description:</strong> ${project.socialImpact.description}</p>` : ''}
                    ${project.socialImpact?.sdgs && project.socialImpact.sdgs.length > 0 ? 
                        `<p><strong>SDGs:</strong> ${project.socialImpact.sdgs.map(sdg => `SDG ${sdg}`).join(', ')}</p>` : ''}
                </div>
                
                <div class="project-section">
                    <h4>Environmental Impact</h4>
                    ${project.environmentalImpact?.carbonOffset ? `<p><strong>Carbon Offset:</strong> ${formatNumber(project.environmentalImpact.carbonOffset)} tons CO2</p>` : ''}
                    ${project.environmentalImpact?.energyEfficiency ? `<p><strong>Energy Efficiency Improvement:</strong> ${formatNumber(project.environmentalImpact.energyEfficiency)}%</p>` : ''}
                    ${project.environmentalImpact?.description ? `<p><strong>Description:</strong> ${project.environmentalImpact.description}</p>` : ''}
                    ${project.environmentalImpact?.sdgs && project.environmentalImpact.sdgs.length > 0 ? 
                        `<p><strong>SDGs:</strong> ${project.environmentalImpact.sdgs.map(sdg => `SDG ${sdg}`).join(', ')}</p>` : ''}
                </div>
                
                <div class="project-section">
                    <h4>Economic Impact</h4>
                    ${project.economicImpact?.jobsCreated ? `<p><strong>Jobs Created:</strong> ${formatNumber(project.economicImpact.jobsCreated)}</p>` : ''}
                    ${project.economicImpact?.investmentGenerated ? `<p><strong>Investment Generated:</strong> $${formatNumber(project.economicImpact.investmentGenerated)}</p>` : ''}
                    ${project.economicImpact?.description ? `<p><strong>Description:</strong> ${project.economicImpact.description}</p>` : ''}
                    ${project.economicImpact?.sdgs && project.economicImpact.sdgs.length > 0 ? 
                        `<p><strong>SDGs:</strong> ${project.economicImpact.sdgs.map(sdg => `SDG ${sdg}`).join(', ')}</p>` : ''}
                </div>
                
                <div class="project-section">
                    <h4>Governance Impact</h4>
                    ${project.governanceImpact?.participantsCount ? `<p><strong>Governance Participants:</strong> ${formatNumber(project.governanceImpact.participantsCount)}</p>` : ''}
                    ${project.governanceImpact?.proposalsCount ? `<p><strong>Governance Proposals:</strong> ${formatNumber(project.governanceImpact.proposalsCount)}</p>` : ''}
                    ${project.governanceImpact?.description ? `<p><strong>Description:</strong> ${project.governanceImpact.description}</p>` : ''}
                    ${project.governanceImpact?.sdgs && project.governanceImpact.sdgs.length > 0 ? 
                        `<p><strong>SDGs:</strong> ${project.governanceImpact.sdgs.map(sdg => `SDG ${sdg}`).join(', ')}</p>` : ''}
                </div>
                
                <div class="project-section">
                    <h4>Verification Information</h4>
                    ${project.verification?.method ? `<p><strong>Verification Method:</strong> ${formatVerificationMethod(project.verification.method)}</p>` : ''}
                    ${project.verification?.details ? `<p><strong>Verification Details:</strong> ${project.verification.details}</p>` : ''}
                    ${project.verification?.evidenceLinks ? 
                        `<p><strong>Evidence Links:</strong></p>
                        <ul>
                            ${project.verification.evidenceLinks.split('\n').map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('')}
                        </ul>` : ''}
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        
        // Close modal when clicking the close button
        document.getElementById('closeProjectDetailsModal').addEventListener('click', function() {
            modal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Create sample data for demonstration
    function createSampleData() {
        const sampleProjects = [
            {
                id: 'project_sample1',
                userId: 'system',
                projectName: 'EcoChain Carbon Credits',
                projectType: 'environmental',
                blockchain: 'cardano',
                projectDescription: 'A blockchain-based carbon credit marketplace that enables transparent tracking and trading of carbon offsets.',
                projectWebsite: 'https://example.com/ecochain',
                contractAddress: 'addr1qxy8p07...',
                status: 'submitted',
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
                updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
                
                socialImpact: {
                    beneficiaries: 5000,
                    communities: 12,
                    description: 'Supporting indigenous communities through carbon credit revenue sharing.',
                    sdgs: ['1', '5']
                },
                
                environmentalImpact: {
                    carbonOffset: 25000,
                    energyEfficiency: 35,
                    description: 'Facilitating the reduction of 25,000 tons of CO2 through verified carbon offset projects.',
                    sdgs: ['7', '13', '15']
                },
                
                economicImpact: {
                    jobsCreated: 45,
                    investmentGenerated: 750000,
                    description: 'Creating jobs in environmental monitoring and carbon credit verification.',
                    sdgs: ['8', '9']
                },
                
                governanceImpact: {
                    participantsCount: 120,
                    proposalsCount: 15,
                    description: 'Community-driven governance for carbon credit validation and pricing.',
                    sdgs: ['16', '17']
                },
                
                verification: {
                    method: 'third_party',
                    details: 'Verified by ClimateAction Certification, an ISO-accredited carbon credit verifier.',
                    evidenceLinks: 'https://example.com/verification/ecochain\nhttps://example.com/audit/ecochain'
                }
            },
            {
                id: 'project_sample2',
                userId: 'system',
                projectName: 'MicroFinance DAO',
                projectType: 'defi',
                blockchain: 'ethereum',
                projectDescription: 'A decentralized microfinance platform providing loans to underserved entrepreneurs in developing regions.',
                projectWebsite: 'https://example.com/microfinance',
                contractAddress: '0x1234abcd...',
                status: 'submitted',
                createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
                updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
                
                socialImpact: {
                    beneficiaries: 12000,
                    communities: 35,
                    description: 'Providing financial access to unbanked entrepreneurs in rural areas.',
                    sdgs: ['1', '2', '5']
                },
                
                environmentalImpact: {
                    carbonOffset: 0,
                    energyEfficiency: 0,
                    description: '',
                    sdgs: []
                },
                
                economicImpact: {
                    jobsCreated: 120,
                    investmentGenerated: 1500000,
                    description: 'Facilitating small business growth through microloans and financial education.',
                    sdgs: ['8', '9', '10']
                },
                
                governanceImpact: {
                    participantsCount: 350,
                    proposalsCount: 28,
                    description: 'Community-driven loan approval and interest rate setting.',
                    sdgs: ['16', '17']
                },
                
                verification: {
                    method: 'hybrid',
                    details: 'Loan disbursement and repayment tracked on-chain, with off-chain impact verification by local partners.',
                    evidenceLinks: 'https://example.com/verification/microfinance'
                }
            },
            {
                id: 'project_sample3',
                userId: 'system',
                projectName: 'HealthChain Records',
                projectType: 'infrastructure',
                blockchain: 'midnight',
                projectDescription: 'A privacy-focused health record system that enables secure sharing of medical data while maintaining patient privacy.',
                projectWebsite: 'https://example.com/healthchain',
                contractAddress: '',
                status: 'submitted',
                createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
                updatedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(), // 75 days ago
                
                socialImpact: {
                    beneficiaries: 35000,
                    communities: 8,
                    description: 'Improving healthcare access through secure medical record sharing.',
                    sdgs: ['3', '4']
                },
                
                environmentalImpact: {
                    carbonOffset: 500,
                    energyEfficiency: 25,
                    description: 'Reducing paper waste through digital record keeping.',
                    sdgs: ['12']
                },
                
                economicImpact: {
                    jobsCreated: 65,
                    investmentGenerated: 950000,
                    description: 'Creating jobs in healthcare IT and data security.',
                    sdgs: ['8', '9']
                },
                
                governanceImpact: {
                    participantsCount: 80,
                    proposalsCount: 12,
                    description: 'Patient-centered governance for data sharing policies.',
                    sdgs: ['16']
                },
                
                verification: {
                    method: 'blockchain',
                    details: 'All data access and sharing permissions are recorded on-chain with privacy-preserving zero-knowledge proofs.',
                    evidenceLinks: 'https://example.com/verification/healthchain'
                }
            }
        ];
        
        localStorage.setItem('impactWeb3Projects', JSON.stringify(sampleProjects));
    }
    
    // Helper Functions
    
    // Format number with commas
    function formatNumber(num) {
        if (num === null || num === undefined) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    
    // Format project type
    function formatProjectType(type) {
        if (!type) return 'Unknown';
        
        const types = {
            'defi': 'DeFi',
            'nft': 'NFT',
            'dao': 'DAO',
            'infrastructure': 'Infrastructure',
            'social_impact': 'Social Impact',
            'environmental': 'Environmental',
            'other': 'Other'
        };
        
        return types[type] || type;
    }
    
    // Format blockchain
    function formatBlockchain(blockchain) {
        if (!blockchain) return 'Unknown';
        
        const blockchains = {
            'cardano': 'Cardano',
            'midnight': 'Midnight',
            'ethereum': 'Ethereum',
            'polygon': 'Polygon',
            'solana': 'Solana',
            'other': 'Other'
        };
        
        return blockchains[blockchain] || blockchain;
    }
    
    // Format status
    function formatStatus(status) {
        if (!status) return 'Unknown';
        
        const statuses = {
            'draft': 'Draft',
            'submitted': 'Submitted',
            'verified': 'Verified',
            'rejected': 'Rejected'
        };
        
        return statuses[status] || status;
    }
    
    // Format verification method
    function formatVerificationMethod(method) {
        if (!method) return 'Unknown';
        
        const methods = {
            'self': 'Self-reported',
            'third_party': 'Third-party verified',
            'blockchain': 'On-chain data',
            'hybrid': 'Hybrid approach'
        };
        
        return methods[method] || method;
    }
});
