// Impact Measurement Visualization Component
class ImpactVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID ${containerId} not found`);
            return;
        }
        
        this.width = this.container.clientWidth;
        this.height = 400;
        this.margin = { top: 40, right: 30, bottom: 60, left: 60 };
        
        this.init();
    }
    
    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        // Add title
        const title = document.createElement('h3');
        title.textContent = 'Impact Metrics Visualization';
        title.style.textAlign = 'center';
        this.container.insertBefore(title, this.canvas);
        
        // Add controls
        this.createControls();
        
        // Initial data
        this.data = {
            social: [25, 40, 35, 60, 70],
            environmental: [15, 20, 30, 40, 45],
            economic: [30, 45, 55, 65, 80],
            governance: [20, 30, 40, 50, 60]
        };
        
        this.labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Q1'];
        this.activeDataset = 'social';
        
        // Draw initial chart
        this.drawChart();
    }
    
    createControls() {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'impact-controls';
        controlsDiv.style.display = 'flex';
        controlsDiv.style.justifyContent = 'center';
        controlsDiv.style.margin = '20px 0';
        controlsDiv.style.gap = '10px';
        
        const categories = [
            { id: 'social', label: 'Social Impact', color: '#3a86ff' },
            { id: 'environmental', label: 'Environmental Impact', color: '#ff006e' },
            { id: 'economic', label: 'Economic Impact', color: '#38b000' },
            { id: 'governance', label: 'Governance Impact', color: '#ffbe0b' }
        ];
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.label;
            button.style.padding = '8px 16px';
            button.style.border = 'none';
            button.style.borderRadius = '4px';
            button.style.backgroundColor = category.id === this.activeDataset ? category.color : '#f8f9fa';
            button.style.color = category.id === this.activeDataset ? '#ffffff' : '#333333';
            button.style.fontWeight = 'bold';
            button.style.cursor = 'pointer';
            button.style.transition = 'all 0.3s ease';
            
            button.addEventListener('click', () => {
                this.activeDataset = category.id;
                
                // Update button styles
                controlsDiv.querySelectorAll('button').forEach(btn => {
                    const catId = btn.dataset.category;
                    const cat = categories.find(c => c.id === catId);
                    if (cat) {
                        btn.style.backgroundColor = catId === this.activeDataset ? cat.color : '#f8f9fa';
                        btn.style.color = catId === this.activeDataset ? '#ffffff' : '#333333';
                    }
                });
                
                this.drawChart();
            });
            
            button.dataset.category = category.id;
            controlsDiv.appendChild(button);
        });
        
        this.container.appendChild(controlsDiv);
    }
    
    drawChart() {
        const ctx = this.ctx;
        const data = this.data[this.activeDataset];
        const labels = this.labels;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Set chart area
        const chartWidth = this.width - this.margin.left - this.margin.right;
        const chartHeight = this.height - this.margin.top - this.margin.bottom;
        
        // Calculate scales
        const maxValue = Math.max(...data) * 1.1; // Add 10% padding
        const xScale = chartWidth / (data.length - 1);
        const yScale = chartHeight / maxValue;
        
        // Draw axes
        ctx.beginPath();
        ctx.moveTo(this.margin.left, this.margin.top);
        ctx.lineTo(this.margin.left, this.height - this.margin.bottom);
        ctx.lineTo(this.width - this.margin.right, this.height - this.margin.bottom);
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw y-axis labels
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#666666';
        ctx.font = '12px Arial';
        
        const yTicks = 5;
        for (let i = 0; i <= yTicks; i++) {
            const value = (maxValue / yTicks) * i;
            const y = this.height - this.margin.bottom - (value * yScale);
            
            ctx.beginPath();
            ctx.moveTo(this.margin.left - 5, y);
            ctx.lineTo(this.margin.left, y);
            ctx.stroke();
            
            ctx.fillText(Math.round(value), this.margin.left - 10, y);
        }
        
        // Draw x-axis labels
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        for (let i = 0; i < labels.length; i++) {
            const x = this.margin.left + (i * xScale);
            const y = this.height - this.margin.bottom + 10;
            
            ctx.beginPath();
            ctx.moveTo(x, this.height - this.margin.bottom);
            ctx.lineTo(x, this.height - this.margin.bottom + 5);
            ctx.stroke();
            
            ctx.fillText(labels[i], x, y);
        }
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(this.margin.left, this.height - this.margin.bottom - (data[0] * yScale));
        
        for (let i = 1; i < data.length; i++) {
            const x = this.margin.left + (i * xScale);
            const y = this.height - this.margin.bottom - (data[i] * yScale);
            ctx.lineTo(x, y);
        }
        
        // Get color based on active dataset
        let lineColor;
        switch (this.activeDataset) {
            case 'social': lineColor = '#3a86ff'; break;
            case 'environmental': lineColor = '#ff006e'; break;
            case 'economic': lineColor = '#38b000'; break;
            case 'governance': lineColor = '#ffbe0b'; break;
            default: lineColor = '#3a86ff';
        }
        
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw points
        for (let i = 0; i < data.length; i++) {
            const x = this.margin.left + (i * xScale);
            const y = this.height - this.margin.bottom - (data[i] * yScale);
            
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = lineColor;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw area under the line
        ctx.beginPath();
        ctx.moveTo(this.margin.left, this.height - this.margin.bottom - (data[0] * yScale));
        
        for (let i = 1; i < data.length; i++) {
            const x = this.margin.left + (i * xScale);
            const y = this.height - this.margin.bottom - (data[i] * yScale);
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(this.margin.left + ((data.length - 1) * xScale), this.height - this.margin.bottom);
        ctx.lineTo(this.margin.left, this.height - this.margin.bottom);
        ctx.closePath();
        
        ctx.fillStyle = `${lineColor}33`; // Add transparency
        ctx.fill();
        
        // Add title
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 16px Arial';
        
        let title;
        switch (this.activeDataset) {
            case 'social': title = 'Social Impact Metrics'; break;
            case 'environmental': title = 'Environmental Impact Metrics'; break;
            case 'economic': title = 'Economic Impact Metrics'; break;
            case 'governance': title = 'Governance Impact Metrics'; break;
            default: title = 'Impact Metrics';
        }
        
        ctx.fillText(title, this.width / 2, 10);
    }
}

// Initialize visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create visualization container
    const visualizationContainer = document.createElement('div');
    visualizationContainer.id = 'impact-visualization';
    visualizationContainer.style.width = '100%';
    visualizationContainer.style.maxWidth = '800px';
    visualizationContainer.style.margin = '0 auto';
    visualizationContainer.style.padding = '20px';
    visualizationContainer.style.backgroundColor = '#ffffff';
    visualizationContainer.style.borderRadius = '8px';
    visualizationContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    // Find the metrics section and append the visualization
    const metricsSection = document.getElementById('metrics');
    if (metricsSection) {
        const metricsContainer = metricsSection.querySelector('.container');
        if (metricsContainer) {
            metricsContainer.appendChild(visualizationContainer);
            
            // Initialize visualization
            new ImpactVisualization('impact-visualization');
        }
    }
});
