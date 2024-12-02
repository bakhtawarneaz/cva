import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from  '@api/authApi';
import { createOrganization, deleteOrganization, editOrganization } from '@api/organizationApi';
import { createBrand, deleteBrand, editBrand } from '@api/brandApi';
import { createUser, deleteUser, editUser } from '@api/userApi';
import { createCampaign, deleteCampaign, editCampaign } from '@api/campaignApi';
import toast from 'react-hot-toast';

/** Login **/
export function useLogin(navigate, setLoading) {
    return useMutation({
        mutationFn: login,
        onSuccess: () => {
           setLoading(false);
           navigate('/dashboard/home'); 
        },
    });
}

/** Organization **/

export function useCreateOrganization(resetForm, closeModal, handleResetUpload) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createOrganization,
      onSuccess: () => {
        toast.success('Organization created successfully!');
        queryClient.invalidateQueries({ queryKey: ['organization'] });
        resetForm();
        handleResetUpload();
        closeModal();
      },
    });
  }
  
  export function useEditOrganization(closeModal) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: editOrganization,
      onSuccess: () => {
        toast.success('Organization updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['organization'], exact: false });
        closeModal();
      },
    });
  }
  
  export function useDeleteOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteOrganization,
      onSuccess: () => {
        toast.success('Organization status updated!');
        queryClient.invalidateQueries({ queryKey: ['organization'] });
      },
    });
  }


  /** Brand **/

export function useCreateBrand(resetForm, closeModal, handleResetUpload) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      toast.success('Brand created successfully!');
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      resetForm();
      handleResetUpload();
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    }
  });
}

export function useEditBrand(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editBrand,
    onSuccess: () => {
      toast.success('Brand updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['brand'], exact: false });
      closeModal();
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      toast.success('Brand status updated!');
      queryClient.invalidateQueries({ queryKey: ['brand'] });
    },
  });
}


/** User **/

export function useCreateUser(resetForm, closeModal, handleResetUpload) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('User created successfully!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      resetForm();
      handleResetUpload();
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    }
  });
}

export function useEditUser(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      toast.success('User updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
      closeModal();
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User status updated!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}


/** Campaign **/

export function useCreateCampaign(resetForm, closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      toast.success('Campaign created successfully!');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      resetForm();
      closeModal();
    }
  });
}

export function useEditCampaign(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editCampaign,
    onSuccess: () => {
      toast.success('Campaign updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['campaign'], exact: false });
      if (closeModal) {
        closeModal();
      }
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      toast.success('Campaign status updated!');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    },
  });
}