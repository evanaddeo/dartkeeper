import React, { useState } from 'react';
import { Button, Card, Modal } from '../components/common';
import { GameLayout } from '../components/layout';

/**
 * HomePage Component
 * Game selection interface (to be implemented in Step 2)
 */
export const HomePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <GameLayout title="🎯 DartKeeper">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card padding="lg">
          <h2>Welcome to DartKeeper</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Track your darts games with ease. Game selection will be fully implemented in Step 2.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Test Modal
            </Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="success">Success Button</Button>
            <Button variant="danger">Danger Button</Button>
          </div>
        </Card>

        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <Card shadow onClick={() => alert('Cricket clicked!')}>
            <h3>🎯 Cricket</h3>
            <p>Close numbers 15-20 and bullseye</p>
          </Card>
          <Card shadow onClick={() => alert('301 clicked!')}>
            <h3>🎲 301</h3>
            <p>Race to zero from 301</p>
          </Card>
          <Card shadow onClick={() => alert('501 clicked!')}>
            <h3>🎲 501</h3>
            <p>Race to zero from 501</p>
          </Card>
          <Card shadow onClick={() => alert('Prisoner clicked!')}>
            <h3>⛓️ Prisoner</h3>
            <p>Hit 1-20 in sequence</p>
          </Card>
          <Card shadow onClick={() => alert('Golf clicked!')}>
            <h3>⛳ Golf</h3>
            <p>9 holes, lowest score wins</p>
          </Card>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Test Modal">
        <p>This is a test modal to verify the component works correctly!</p>
        <p>You can close it by clicking the X, pressing ESC, or clicking the backdrop.</p>
        <div style={{ marginTop: '1.5rem' }}>
          <Button variant="primary" onClick={() => setShowModal(false)} fullWidth>
            Close Modal
          </Button>
        </div>
      </Modal>
    </GameLayout>
  );
};

