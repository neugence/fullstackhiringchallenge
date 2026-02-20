import React from 'react';
import { Sigma, Table, Clock, Save } from 'lucide-react';

export default function FeatureGuide() {
    return (
        <div className="feature-guide">
            <h3>Quick Feature Guide</h3>
            <div className="guide-grid">
                <div className="guide-item">
                    <div className="guide-icon math">
                        <Sigma size={20} />
                    </div>
                    <div className="guide-text">
                        <h4>Math Formulas</h4>
                        <p>Type <code>$formula$</code> (e.g. <code>${'$\\frac{a}{b}$'}</code>) to auto-render. Click on it to edit.</p>
                    </div>
                </div>

                <div className="guide-item">
                    <div className="guide-icon table">
                        <Table size={20} />
                    </div>
                    <div className="guide-text">
                        <h4>Smart Tables</h4>
                        <p>Insert custom grids. Click inside any cell to show Row/Column management tools.</p>
                    </div>
                </div>

                <div className="guide-item">
                    <div className="guide-icon history">
                        <Clock size={20} />
                    </div>
                    <div className="guide-text">
                        <h4>Version History</h4>
                        <p>Click the clock to view previous notes or save a manual snapshot of your work.</p>
                    </div>
                </div>

                <div className="guide-item">
                    <div className="guide-icon status">
                        <Save size={20} />
                    </div>
                    <div className="guide-text">
                        <h4>Persistence</h4>
                        <p>Everything is auto-saved to your browser. Your work is safe even after refresh.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
