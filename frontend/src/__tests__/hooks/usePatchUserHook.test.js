import { renderHook, act, waitFor } from '@testing-library/react';
import { usePatchUserHook } from '@/hooks/userHooks';
import { patchUserService } from '@/api/userServices';

// Mock the patchUserService
jest.mock('../../api/userServices', () => ({
    ...jest.requireActual('../../api/userServices'),
    patchUserService: jest.fn(),
}));

describe('usePatchUserHook', () => {
  const mockFormData = new FormData();
  mockFormData.append('username', 'testuser');

  const mockUrlParam = 'user-id-123';

  beforeEach(() => {
    patchUserService.mockClear();
  });

  it('should initialize with correct default states', () => {
    const { result } = renderHook(() => usePatchUserHook(mockUrlParam, null));

    expect(result.current.status).toBeNull();
    expect(result.current.isPutLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(patchUserService).not.toHaveBeenCalled();
  });

  it('should not call patchUserService if formData is initially null', () => {
    renderHook(() => usePatchUserHook(mockUrlParam, null));
    expect(patchUserService).not.toHaveBeenCalled();
  });

  it('should call patchUserService and update state on successful patch', async () => {
    const mockSuccessResponse = { status: 200, data: { message: 'Success' } };
    patchUserService.mockResolvedValue(mockSuccessResponse);

    const { result, rerender } = renderHook(
      ({ urlParam, formData }) => usePatchUserHook(urlParam, formData),
      { initialProps: { urlParam: mockUrlParam, formData: null } }
    );

    // Initially, loading is false, and service not called
    expect(result.current.isPutLoading).toBe(false);
    expect(patchUserService).not.toHaveBeenCalled();

    // Update formData to trigger the effect
    await act(async () => {
      rerender({ urlParam: mockUrlParam, formData: mockFormData });
    });

    expect(patchUserService).toHaveBeenCalledTimes(1);
    expect(patchUserService).toHaveBeenCalledWith(mockFormData); // urlParam is not used by patchUserService directly in the hook

    expect(result.current.isPutLoading).toBe(false); // Should be false after completion
    expect(result.current.status).toBe(mockSuccessResponse.status);
    expect(result.current.error).toBeNull();
  });


  it('should call patchUserService and update state on failed patch', async () => {
    const mockError = new Error('Network Error');
    patchUserService.mockRejectedValue(mockError);

    const { result, rerender } = renderHook(
      ({ urlParam, formData }) => usePatchUserHook(urlParam, formData),
      { initialProps: { urlParam: mockUrlParam, formData: null } }
    );

    await act(async () => {
      rerender({ urlParam: mockUrlParam, formData: mockFormData });
    });

    expect(patchUserService).toHaveBeenCalledTimes(1);
    expect(patchUserService).toHaveBeenCalledWith(mockFormData);

    expect(result.current.isPutLoading).toBe(false);
    expect(result.current.status).toBeNull(); // Status might not be set on error, or reset
    expect(result.current.error).toBe(mockError);
  });

  it('should reset state and call patchUserService again if formData changes', async () => {
    const mockSuccessResponse1 = { status: 201 };
    const mockSuccessResponse2 = { status: 200 };
    const formData1 = new FormData();
    formData1.append('field1', 'value1');
    const formData2 = new FormData();
    formData2.append('field2', 'value2');

    patchUserService.mockResolvedValueOnce(mockSuccessResponse1);

    const { result, rerender } = renderHook(
      ({ urlParam, formData }) => usePatchUserHook(urlParam, formData),
      { initialProps: { urlParam: mockUrlParam, formData: null } }
    );

    // First call
    await act(async () => {
      rerender({ urlParam: mockUrlParam, formData: formData1 });
    });

    expect(patchUserService).toHaveBeenCalledWith(formData1);
    expect(result.current.status).toBe(mockSuccessResponse1.status);
    expect(result.current.isPutLoading).toBe(false);
    expect(result.current.error).toBeNull();

    // Prepare for second call
    patchUserService.mockResolvedValueOnce(mockSuccessResponse2);

    // Second call with different formData
    await act(async () => {
      rerender({ urlParam: mockUrlParam, formData: formData2 });
    });

    expect(patchUserService).toHaveBeenCalledWith(formData2);
    expect(patchUserService).toHaveBeenCalledTimes(2); // Called once for formData1, once for formData2
    expect(result.current.status).toBe(mockSuccessResponse2.status);
    expect(result.current.isPutLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should not make a new API call and retain status if formData becomes null after a successful call', async () => {
    const mockSuccessResponse = { status: 200 };
    patchUserService.mockResolvedValue(mockSuccessResponse);

    const { result, rerender } = renderHook(
      ({ urlParam, formData }) => usePatchUserHook(urlParam, formData),
      { initialProps: { urlParam: mockUrlParam, formData: mockFormData } }
    );

    // Wait for the initial successful call to complete and state to update
    await waitFor(() => expect(result.current.status).toBe(mockSuccessResponse.status));
    expect(patchUserService).toHaveBeenCalledTimes(1);
    expect(patchUserService).toHaveBeenCalledWith(mockFormData);
    expect(result.current.isPutLoading).toBe(false);
    expect(result.current.error).toBeNull();

    // Clear mock calls for the next part of the test
    patchUserService.mockClear();

    // Update formData to null
    await act(async () => {
      rerender({ urlParam: mockUrlParam, formData: null });
    });

    // patchUserService should not have been called again
    expect(patchUserService).not.toHaveBeenCalled();
    expect(result.current.isPutLoading).toBe(false);
    // Status and error should be retained from the last successful call
    expect(result.current.status).toBe(mockSuccessResponse.status);
    expect(result.current.error).toBeNull();
  });

  it('should not make a new API call and retain error if formData becomes null after a failed call', async () => {
    const mockError = new Error('Initial API Error');
    patchUserService.mockRejectedValue(mockError);

    const { result, rerender } = renderHook(
      ({ urlParam, formData }) => usePatchUserHook(urlParam, formData),
      { initialProps: { urlParam: mockUrlParam, formData: mockFormData } }
    );

    // Wait for the initial failed call to complete and state to update
    await waitFor(() => expect(result.current.error).toBe(mockError));
    expect(patchUserService).toHaveBeenCalledTimes(1);
    expect(patchUserService).toHaveBeenCalledWith(mockFormData);
    expect(result.current.isPutLoading).toBe(false);
    expect(result.current.status).toBeNull();

    patchUserService.mockClear();

    await act(async () => {
      rerender({ urlParam: mockUrlParam, formData: null });
    });

    expect(patchUserService).not.toHaveBeenCalled();
    expect(result.current.isPutLoading).toBe(false);
    expect(result.current.status).toBeNull(); // Status remains null from the error
    expect(result.current.error).toBe(mockError); // Error is retained
  });
});
