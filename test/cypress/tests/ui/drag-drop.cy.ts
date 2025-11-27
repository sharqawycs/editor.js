describe('Drag and Drop', () => {
  it('should reorder blocks on dragging first block after the second block', () => {
    cy.createEditor({
      data: {
        blocks: [
          { type: 'paragraph', data: { text: 'Block 1' } },
          { type: 'paragraph', data: { text: 'Block 2' } },
          { type: 'paragraph', data: { text: 'Block 3' } },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('[data-cy=block-wrapper]')
      .should('have.length', 3);

    // Drag the first block and drop it after the second
    cy.get('[data-cy=editorjs]')
      .find('[data-cy=block-wrapper]')
      .first()
      .then(($source) => {
        const dataTransfer = new DataTransfer();

        cy.wrap($source)
          .trigger('dragstart', { dataTransfer });

        cy.get('[data-cy=editorjs]')
          .find('[data-cy=block-wrapper]')
          .eq(1)
          .then(($target) => {
            const rect = $target[0].getBoundingClientRect();
            const clientY = rect.top + rect.height * 0.75; // middle-below

            cy.wrap($target)
              .trigger('dragover', { dataTransfer, clientY })
              .trigger('drop', { dataTransfer, clientY });

            cy.wrap($source).trigger('dragend');
          });
      });

    // The order should be: Block 2, Block 1, Block 3
    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .then(($els) => {
        expect($els[0].textContent.trim()).to.eq('Block 2');
        expect($els[1].textContent.trim()).to.eq('Block 1');
        expect($els[2].textContent.trim()).to.eq('Block 3');
      });
  });
});
