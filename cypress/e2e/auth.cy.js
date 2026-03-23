describe('Authentication Flow', () => {
    it('should allow a user to log in', () => {
        // Start with the login page
        cy.visit('/login');
        // Check if the login form is rendered
        cy.get('h2').contains('Olá, de novo!');
        // We will use stubbing to avoid hitting the actual API
        cy.intercept('POST', '**/auth/login', {
            statusCode: 200,
            body: {
                token: 'fake-jwt-token',
                user: { id: '1', name: 'Test User' }
            }
        }).as('loginRequest');
        // Fil the form
        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="password"]').type('123456');
        // Submit the form
        cy.get('button[type="submit"]').click();
        // Wait for the stubbed request
        cy.wait('@loginRequest');
        // Verify that we are redirected to the timeline
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
    it('should show validation errors on empty submission', () => {
        cy.visit('/login');
        cy.get('button[type="submit"]').click();
        cy.contains('O e-mail é obrigatório').should('be.visible');
        cy.contains('A senha é obrigatória').should('be.visible');
    });
});
