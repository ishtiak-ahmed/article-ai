import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteArticleDialog } from '@/app/(features)/(dashboard)/components/DeleteArticle'

describe('DeleteArticleDialog', () => {
  const mockArticle = {
    articleId: '123',
    articleTitle: 'Test Article',
    onDelete: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the trigger button by default', () => {
    render(<DeleteArticleDialog {...mockArticle} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
  })

  it('uses custom trigger when provided', () => {
    const customTrigger = <button data-testid="custom-trigger">Delete</button>
    render(<DeleteArticleDialog {...mockArticle} trigger={customTrigger} />)
    expect(screen.getByTestId('custom-trigger')).toBeInTheDocument()
    expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument()
  })

  it('displays the correct article title in dialog', async () => {
    render(<DeleteArticleDialog {...mockArticle} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(
        screen.getByText(`"${mockArticle.articleTitle}"`)
      ).toBeInTheDocument()
    })
  })

  it('calls onDelete when confirmation button is clicked', async () => {
    render(<DeleteArticleDialog {...mockArticle} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(async () => {
      const deleteButton = screen.getByTestId('delete-confirm-button')
      fireEvent.click(deleteButton!)
      expect(mockArticle.onDelete).toHaveBeenCalledWith(mockArticle.articleId)
    })
  })

  it('disables buttons during deletion', async () => {
    mockArticle.onDelete.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    render(<DeleteArticleDialog {...mockArticle} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(async () => {
      const deleteButton = screen.getByTestId('delete-confirm-button')
      const cancelButton = screen.getByText('Cancel').closest('button')

      fireEvent.click(deleteButton!)

      expect(deleteButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
    })
  })

  it('closes dialog after successful deletion', async () => {
    render(<DeleteArticleDialog {...mockArticle} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(async () => {
      const deleteButton = screen.getByTestId('delete-confirm-button')
      fireEvent.click(deleteButton!)

      await waitFor(() => {
        expect(screen.queryByText('Delete Article')).not.toBeInTheDocument()
      })
    })
  })
})
