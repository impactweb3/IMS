// Data Analysis Module for Impact Web3 MVP
class ImpactAnalysis {
    constructor() {
        this.metrics = {};
        this.categories = {
            social: ['community_engagement', 'job_creation', 'education_events', 'education_participants'],
            environmental: ['carbon_reduction', 'renewable_adoption', 'resource_efficiency'],
            economic: ['wallets_created', 'revenue_generation', 'businesses_impacted', 'individuals_impacted'],
            governance: ['partnerships', 'transparency_score', 'stakeholder_engagement']
        };
    }

    // Load sample data for demonstration
    loadSampleData() {
        // Social metrics
        this.metrics.community_engagement = {
            name: 'Community Engagement',
            unit: 'people',
            data: [
                { period: 'Q1 2024', target: 500, actual: 450 },
                { period: 'Q2 2024', target: 600, actual: 580 },
                { period: 'Q3 2024', target: 700, actual: 750 },
                { period: 'Q4 2024', target: 800, actual: 820 }
            ]
        };

        this.metrics.job_creation = {
            name: 'Job Creation',
            unit: 'jobs',
            data: [
                { period: 'Q1 2024', target: 15, actual: 12 },
                { period: 'Q2 2024', target: 20, actual: 18 },
                { period: 'Q3 2024', target: 25, actual: 27 },
                { period: 'Q4 2024', target: 30, actual: 32 }
            ]
        };

        this.metrics.education_events = {
            name: 'Educational Events',
            unit: 'events',
            data: [
                { period: 'Q1 2024', target: 12, actual: 10 },
                { period: 'Q2 2024', target: 15, actual: 14 },
                { period: 'Q3 2024', target: 18, actual: 20 },
                { period: 'Q4 2024', target: 20, actual: 22 }
            ]
        };

        this.metrics.education_participants = {
            name: 'Education Participants',
            unit: 'people',
            data: [
                { period: 'Q1 2024', target: 300, actual: 280 },
                { period: 'Q2 2024', target: 350, actual: 340 },
                { period: 'Q3 2024', target: 400, actual: 420 },
                { period: 'Q4 2024', target: 450, actual: 470 }
            ]
        };

        // Environmental metrics
        this.metrics.carbon_reduction = {
            name: 'Carbon Reduction',
            unit: '%',
            data: [
                { period: 'Q1 2024', target: 20, actual: 15 },
                { period: 'Q2 2024', target: 25, actual: 22 },
                { period: 'Q3 2024', target: 30, actual: 28 },
                { period: 'Q4 2024', target: 35, actual: 38 }
            ]
        };

        this.metrics.renewable_adoption = {
            name: 'Renewable Energy Adoption',
            unit: '%',
            data: [
                { period: 'Q1 2024', target: 30, actual: 25 },
                { period: 'Q2 2024', target: 40, actual: 35 },
                { period: 'Q3 2024', target: 50, actual: 48 },
                { period: 'Q4 2024', target: 60, actual: 65 }
            ]
        };

        this.metrics.resource_efficiency = {
            name: 'Resource Efficiency',
            unit: '%',
            data: [
                { period: 'Q1 2024', target: 15, actual: 12 },
                { period: 'Q2 2024', target: 20, actual: 18 },
                { period: 'Q3 2024', target: 25, actual: 26 },
                { period: 'Q4 2024', target: 30, actual: 32 }
            ]
        };

        // Economic metrics
        this.metrics.wallets_created = {
            name: 'New Wallets Created',
            unit: 'wallets',
            data: [
                { period: 'Q1 2024', target: 1000, actual: 850 },
                { period: 'Q2 2024', target: 1500, actual: 1400 },
                { period: 'Q3 2024', target: 2000, actual: 2100 },
                { period: 'Q4 2024', target: 2500, actual: 2700 }
            ]
        };

        this.metrics.revenue_generation = {
            name: 'Revenue Generation',
            unit: 'USD',
            data: [
                { period: 'Q1 2024', target: 50000, actual: 45000 },
                { period: 'Q2 2024', target: 75000, actual: 70000 },
                { period: 'Q3 2024', target: 100000, actual: 105000 },
                { period: 'Q4 2024', target: 125000, actual: 130000 }
            ]
        };

        this.metrics.businesses_impacted = {
            name: 'Businesses Impacted',
            unit: 'businesses',
            data: [
                { period: 'Q1 2024', target: 25, actual: 20 },
                { period: 'Q2 2024', target: 35, actual: 30 },
                { period: 'Q3 2024', target: 45, actual: 48 },
                { period: 'Q4 2024', target: 55, actual: 60 }
            ]
        };

        this.metrics.individuals_impacted = {
            name: 'Individuals Impacted',
            unit: 'people',
            data: [
                { period: 'Q1 2024', target: 500, actual: 450 },
                { period: 'Q2 2024', target: 750, actual: 700 },
                { period: 'Q3 2024', target: 1000, actual: 1050 },
                { period: 'Q4 2024', target: 1250, actual: 1300 }
            ]
        };

        // Governance metrics
        this.metrics.partnerships = {
            name: 'Partnerships',
            unit: 'partnerships',
            data: [
                { period: 'Q1 2024', target: 8, actual: 6 },
                { period: 'Q2 2024', target: 10, actual: 9 },
                { period: 'Q3 2024', target: 12, actual: 13 },
                { period: 'Q4 2024', target: 15, actual: 16 }
            ]
        };

        this.metrics.transparency_score = {
            name: 'Transparency Score',
            unit: 'score',
            data: [
                { period: 'Q1 2024', target: 80, actual: 75 },
                { period: 'Q2 2024', target: 85, actual: 82 },
                { period: 'Q3 2024', target: 90, actual: 88 },
                { period: 'Q4 2024', target: 95, actual: 96 }
            ]
        };

        this.metrics.stakeholder_engagement = {
            name: 'Stakeholder Engagement',
            unit: 'stakeholders',
            data: [
                { period: 'Q1 2024', target: 50, actual: 45 },
                { period: 'Q2 2024', target: 60, actual: 58 },
                { period: 'Q3 2024', target: 70, actual: 72 },
                { period: 'Q4 2024', target: 80, actual: 85 }
            ]
        };
    }

    // Calculate variance between target and actual values
    calculateVariance(metricId, period = null) {
        const metric = this.metrics[metricId];
        if (!metric) return null;

        if (period) {
            const periodData = metric.data.find(d => d.period === period);
            if (!periodData) return null;
            
            const variance = periodData.actual - periodData.target;
            const percentVariance = periodData.target !== 0 ? (variance / periodData.target) * 100 : 0;
            
            return {
                absolute: variance,
                percent: percentVariance,
                positive: variance >= 0
            };
        } else {
            // Calculate variance across all periods
            return metric.data.map(d => {
                const variance = d.actual - d.target;
                const percentVariance = d.target !== 0 ? (variance / d.target) * 100 : 0;
                
                return {
                    period: d.period,
                    absolute: variance,
                    percent: percentVariance,
                    positive: variance >= 0
                };
            });
        }
    }

    // Calculate trend for a specific metric
    calculateTrend(metricId) {
        const metric = this.metrics[metricId];
        if (!metric || metric.data.length < 2) return null;
        
        // Calculate the slope of the trend line using actual values
        const n = metric.data.length;
        const periods = Array.from({ length: n }, (_, i) => i + 1); // Convert periods to numeric values
        
        const actualValues = metric.data.map(d => d.actual);
        
        // Calculate means
        const meanX = periods.reduce((sum, x) => sum + x, 0) / n;
        const meanY = actualValues.reduce((sum, y) => sum + y, 0) / n;
        
        // Calculate slope
        let numerator = 0;
        let denominator = 0;
        
        for (let i = 0; i < n; i++) {
            numerator += (periods[i] - meanX) * (actualValues[i] - meanY);
            denominator += Math.pow(periods[i] - meanX, 2);
        }
        
        const slope = denominator !== 0 ? numerator / denominator : 0;
        
        // Determine trend direction
        let trend = 'stable';
        if (slope > 0.05 * meanY) {
            trend = 'increasing';
        } else if (slope < -0.05 * meanY) {
            trend = 'decreasing';
        }
        
        return {
            slope,
            trend,
            percentChange: meanY !== 0 ? (slope / meanY) * 100 : 0
        };
    }

    // Calculate overall performance score for a category
    calculateCategoryScore(category) {
        const metricIds = this.categories[category];
        if (!metricIds || metricIds.length === 0) return null;
        
        let totalScore = 0;
        let totalWeight = 0;
        
        metricIds.forEach(metricId => {
            const metric = this.metrics[metricId];
            if (!metric || metric.data.length === 0) return;
            
            // Get the most recent period data
            const latestData = metric.data[metric.data.length - 1];
            
            // Calculate achievement percentage
            const achievementPercent = latestData.target !== 0 ? 
                (latestData.actual / latestData.target) * 100 : 0;
            
            // Cap at 120% to prevent outliers from skewing the score
            const cappedPercent = Math.min(achievementPercent, 120);
            
            // Convert to a 0-100 score
            const score = cappedPercent > 100 ? 
                100 + (cappedPercent - 100) / 4 : // Diminishing returns above 100%
                cappedPercent;
            
            // Add to total with equal weighting for now
            totalScore += score;
            totalWeight += 1;
        });
        
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }

    // Calculate overall impact score across all categories
    calculateOverallImpactScore() {
        const categories = Object.keys(this.categories);
        let totalScore = 0;
        let totalWeight = 0;
        
        categories.forEach(category => {
            const score = this.calculateCategoryScore(category);
            if (score !== null) {
                // Apply category weights (could be customized)
                let weight = 1;
                switch (category) {
                    case 'social': weight = 1; break;
                    case 'environmental': weight = 1; break;
                    case 'economic': weight = 1; break;
                    case 'governance': weight = 1; break;
                }
                
                totalScore += score * weight;
                totalWeight += weight;
            }
        });
        
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }

    // Generate impact summary report
    generateImpactSummary() {
        const categories = Object.keys(this.categories);
        const summary = {
            overallScore: this.calculateOverallImpactScore(),
            categoryScores: {},
            topPerformingMetrics: [],
            underperformingMetrics: [],
            trends: {}
        };
        
        // Calculate category scores
        categories.forEach(category => {
            summary.categoryScores[category] = this.calculateCategoryScore(category);
        });
        
        // Identify top performing and underperforming metrics
        Object.keys(this.metrics).forEach(metricId => {
            const metric = this.metrics[metricId];
            if (!metric || metric.data.length === 0) return;
            
            // Get the most recent period data
            const latestData = metric.data[metric.data.length - 1];
            
            // Calculate achievement percentage
            const achievementPercent = latestData.target !== 0 ? 
                (latestData.actual / latestData.target) * 100 : 0;
            
            if (achievementPercent >= 110) {
                summary.topPerformingMetrics.push({
                    id: metricId,
                    name: metric.name,
                    achievementPercent,
                    period: latestData.period
                });
            } else if (achievementPercent < 90) {
                summary.underperformingMetrics.push({
                    id: metricId,
                    name: metric.name,
                    achievementPercent,
                    period: latestData.period
                });
            }
            
            // Calculate trends
            summary.trends[metricId] = this.calculateTrend(metricId);
        });
        
        // Sort metrics by achievement percentage
        summary.topPerformingMetrics.sort((a, b) => b.achievementPercent - a.achievementPercent);
        summary.underperformingMetrics.sort((a, b) => a.achievementPercent - b.achievementPercent);
        
        return summary;
    }

    // Generate data for visualization
    generateVisualizationData(metricIds = null) {
        const result = {};
        
        // If specific metrics are requested, use those; otherwise use all metrics
        const metricsToProcess = metricIds ? 
            metricIds.filter(id => this.metrics[id]) : 
            Object.keys(this.metrics);
        
        metricsToProcess.forEach(metricId => {
            const metric = this.metrics[metricId];
            
            result[metricId] = {
                name: metric.name,
                unit: metric.unit,
                periods: metric.data.map(d => d.period),
                targets: metric.data.map(d => d.target),
                actuals: metric.data.map(d => d.actual),
                variances: this.calculateVariance(metricId)
            };
        });
        
        return result;
    }

    // Generate category comparison data
    generateCategoryComparison() {
        const categories = Object.keys(this.categories);
        const result = {
            categories,
            scores: categories.map(category => this.calculateCategoryScore(category)),
            metrics: {}
        };
        
        // Add metrics count per category
        categories.forEach(category => {
            result.metrics[category] = this.categories[category].length;
        });
        
        return result;
    }
}

// Export the class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImpactAnalysis;
}
