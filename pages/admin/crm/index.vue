<template>
    <div class="flex min-h-screen bg-gray-100">
        <div class="w-16 md:w-56 flex-shrink-0 fixed top-0 left-0 h-full z-50">
            <Sidebar />
        </div>

        <div class="flex-grow ml-16 md:ml-56 p-4 sm:p-6 md:p-8">
            <div class="max-w-7xl mx-auto">
                <div class="mb-6 border-b border-gray-300">
                    <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            @click="activeTab = tab.id"
                            :class="[
                                activeTab === tab.id
                                    ? 'border-gray-800 text-gray-900 font-semibold'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400',
                                'whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm transition-colors duration-150 focus:outline-none'
                            ]"
                        >
                            {{ tab.name }}
                        </button>
                    </nav>
                </div>

                <div class="bg-white p-5 sm:p-6 rounded-lg shadow-md min-h-[60vh]">
                    <section v-if="activeTab === 'campaigns'" key="campaigns" class="space-y-6">
                        <h2 class="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">Campaigns</h2>
                        <form @submit.prevent="handleCreateCampaign" class="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                            <h3 class="text-lg font-medium text-gray-700 mb-2">Create New Campaign</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="camp-name" class="block text-sm font-medium text-gray-600 mb-1">Name:</label>
                                    <input type="text" id="camp-name" v-model="newCampaign.name" required class="form-input">
                                </div>
                                <div>
                                    <label for="camp-tier" class="block text-sm font-medium text-gray-600 mb-1">Target User Tier:</label>
                                    <select id="camp-tier" v-model="newCampaign.userTier" required class="form-select">
                                        <option disabled value="">-- Select Tier --</option>
                                        <option v-for="tier in userTiers" :key="tier" :value="tier">{{ tier }}</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="camp-start" class="block text-sm font-medium text-gray-600 mb-1">Start Date:</label>
                                    <input type="datetime-local" id="camp-start" v-model="newCampaign.startDate" required class="form-input">
                                </div>
                                <div>
                                    <label for="camp-end" class="block text-sm font-medium text-gray-600 mb-1">End Date:</label>
                                    <input type="datetime-local" id="camp-end" v-model="newCampaign.endDate" required class="form-input">
                                </div>
                                <div class="md:col-span-2">
                                    <label for="camp-desc" class="block text-sm font-medium text-gray-600 mb-1">Description (Optional):</label>
                                    <textarea id="camp-desc" v-model="newCampaign.description" rows="2" class="form-textarea"></textarea>
                                </div>
                            </div>
                            <button type="submit" :disabled="isCreatingCampaign" class="btn-primary">
                                {{ isCreatingCampaign ? 'Creating...' : 'Create Campaign' }}
                            </button>
                        </form>
                        <div class="pt-4">
                            <h3 class="text-lg font-medium text-gray-700 mb-3">Existing Campaigns</h3>
                            <div v-if="isLoadingCampaigns" class="loading-text">Loading campaigns...</div>
                            <ul v-else-if="campaigns.length > 0" class="table-list">
                                <li v-for="camp in campaigns" :key="camp.id" class="table-list-item">
                                    <div>
                                        <span class="font-semibold">{{ camp.name }}</span> (Tier: {{ camp.userTier }})
                                        <br/><span class="text-xs text-gray-500"> {{ formatDateTime(camp.startDate) }} - {{ formatDateTime(camp.endDate) }} | Pools: {{ camp.couponPools?.length || 0 }}</span>
                                    </div>
                                    <button @click="handleDeleteCampaign(camp.id)" :disabled="isDeletingCampaign === camp.id" class="btn-danger-xs">
                                        {{ isDeletingCampaign === camp.id ? 'Deleting...' : 'Delete' }}
                                    </button>
                                </li>
                            </ul>
                            <div v-else class="italic-text">No campaigns found.</div>
                        </div>
                    </section>

                    <section v-if="activeTab === 'pools'" key="pools" class="space-y-6">
                        <h2 class="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">Coupon Pools</h2>
                        <form @submit.prevent="handleCreatePool" class="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                            <h3 class="text-lg font-medium text-gray-700 mb-2">Create New Pool</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="pool-name" class="block text-sm font-medium text-gray-600 mb-1">Name:</label>
                                    <input type="text" id="pool-name" v-model="newPool.name" required class="form-input">
                                </div>
                                <div>
                                    <label for="pool-total" class="block text-sm font-medium text-gray-600 mb-1">Expected Total Coupons:</label>
                                    <input type="number" id="pool-total" v-model.number="newPool.totalCoupons" required min="1" class="form-input">
                                </div>
                                <div class="md:col-span-2">
                                    <label for="pool-desc" class="block text-sm font-medium text-gray-600 mb-1">Description (Optional):</label>
                                    <textarea id="pool-desc" v-model="newPool.description" rows="2" class="form-textarea"></textarea>
                                </div>
                                <div>
                                    <label for="pool-assign-camp" class="block text-sm font-medium text-gray-600 mb-1">Assign to Campaign (Optional):</label>
                                    <select id="pool-assign-camp" v-model="selectedCampaignForNewPool" class="form-select">
                                        <option value="">-- Don't Assign Now --</option>
                                        <option v-for="camp in campaigns" :key="camp.id" :value="camp.id">{{ camp.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" :disabled="isCreatingPool" class="btn-primary">
                                {{ isCreatingPool ? 'Creating...' : 'Create Pool' }}
                            </button>
                        </form>
                        <div class="pt-4">
                            <h3 class="text-lg font-medium text-gray-700 mb-3">Existing Pools</h3>
                            <div v-if="isLoadingPools" class="loading-text">Loading pools...</div>
                            <ul v-else-if="couponPools.length > 0" class="table-list">
                                <li v-for="pool in couponPools" :key="pool.id" class="table-list-item">
                                    <div>
                                        <span class="font-semibold">{{ pool.name }}</span> 
                                        <br/> <span class="text-xs text-gray-500">Campaign: {{ pool.campaign?.name || 'Not Assigned' }}</span>
                                    </div>
                                    <div class="flex space-x-2 items-center">
                                        <select v-if="!pool.campaignId" v-model="assignCampaignMap[pool.id]" class="form-select form-select-sm" title="Select campaign to assign">
                                            <option value="">Assign to...</option>
                                            <option v-for="camp in campaigns" :key="camp.id" :value="camp.id">{{ camp.name }}</option>
                                        </select>
                                        <button v-if="!pool.campaignId" @click="handleAssignPoolToCampaign(pool.id)" :disabled="!assignCampaignMap[pool.id] || isAssigningPool === pool.id" class="btn-secondary-xs">
                                            {{ isAssigningPool === pool.id ? 'Assigning...' : 'Assign' }}
                                        </button>
                                        <button @click="handleDeletePool(pool.id)" :disabled="isDeletingPool === pool.id" class="btn-danger-xs">
                                            {{ isDeletingPool === pool.id ? 'Deleting...' : 'Delete' }}
                                        </button>
                                    </div>
                                </li>
                            </ul>
                            <div v-else class="italic-text">No coupon pools found.</div>
                        </div>
                    </section>

                    <section v-if="activeTab === 'coupons'" key="coupons" class="space-y-6">
                        <h2 class="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">Coupons</h2>
                        <form @submit.prevent="handleCreateCoupon" class="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                            <h3 class="text-lg font-medium text-gray-700 mb-2">Create New Coupon(s)</h3>
                            <div>
                                <label for="coup-pool" class="block text-sm font-medium text-gray-600 mb-1">Assign to Pool: <span class="text-red-500">*</span></label>
                                <select id="coup-pool" v-model="newCouponData.poolId" required class="form-select">
                                    <option disabled value="">-- Select Pool --</option>
                                    <option v-for="pool in couponPools" :key="pool.id" :value="pool.id">{{ pool.name }}</option>
                                </select>
                            </div>
                            <div class="flex items-center space-x-4">
                                <span class="text-sm font-medium text-gray-600">Creation Mode:</span>
                                <label class="flex items-center">
                                    <input type="radio" v-model="createMode" value="single" class="form-radio">
                                    <span class="ml-2 text-sm">Single Coupon</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" v-model="createMode" value="bulk" class="form-radio">
                                    <span class="ml-2 text-sm">Bulk Create</span>
                                </label>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t mt-4">
                                <div>
                                    <label for="coup-discount-type" class="block text-sm font-medium text-gray-600 mb-1">Discount Type:</label>
                                    <select id="coup-discount-type" v-model="newCouponData.discountType" required class="form-select">
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED_AMOUNT">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="coup-discount-value" class="block text-sm font-medium text-gray-600 mb-1">Discount Value:</label>
                                    <input type="number" id="coup-discount-value" v-model.number="newCouponData.discountValue" required step="any" min="0" class="form-input">
                                </div>
                                <div>
                                    <label for="coup-max-discount" class="block text-sm font-medium text-gray-600 mb-1">Max Discount ({{ newCouponData.discountType === 'PERCENTAGE' ? '%' : 'Amount' }}):</label>
                                    <input type="number" id="coup-max-discount" v-model.number="newCouponData.maxDiscountValue" required step="any" min="0" class="form-input">
                                </div>
                                <div>
                                    <label for="coup-min-order" class="block text-sm font-medium text-gray-600 mb-1">Min. Order Value:</label>
                                    <input type="number" id="coup-min-order" v-model.number="newCouponData.minOrderValue" required step="any" min="0" class="form-input">
                                </div>
                                <div>
                                    <label for="coup-usage-limit" class="block text-sm font-medium text-gray-600 mb-1">Usage Limit (per target):</label>
                                    <input type="number" id="coup-usage-limit" v-model.number="newCouponData.usageLimit" required min="1" class="form-input">
                                </div>
                                <div>
                                    <label for="coup-expires" class="block text-sm font-medium text-gray-600 mb-1">Expires At:</label>
                                    <input type="datetime-local" id="coup-expires" v-model="newCouponData.expiresAt" required class="form-input">
                                </div>
                            </div>
                            <div v-if="createMode === 'single'">
                                <label for="coup-code" class="block text-sm font-medium text-gray-600 mb-1">Coupon Code:</label>
                                <input type="text" id="coup-code" v-model="newCouponData.code" required class="form-input">
                            </div>
                            <div v-if="createMode === 'bulk'" class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t mt-4">
                                <div>
                                    <label for="bulk-quantity" class="block text-sm font-medium text-gray-600 mb-1">Number of Coupons:</label>
                                    <input type="number" id="bulk-quantity" v-model.number="bulkOptions.quantity" required min="1" max="1000" class="form-input">
                                    <p class="text-xs text-gray-500 mt-1">Max 1000 per batch.</p>
                                </div>
                                <div>
                                    <label for="bulk-prefix" class="block text-sm font-medium text-gray-600 mb-1">Code Prefix (Optional):</label>
                                    <input type="text" id="bulk-prefix" v-model="bulkOptions.prefix" placeholder="e.g., SUMMER-" class="form-input">
                                </div>
                                <div>
                                    <label for="bulk-length" class="block text-sm font-medium text-gray-600 mb-1">Random Part Length:</label>
                                    <input type="number" id="bulk-length" v-model.number="bulkOptions.length" required min="4" max="16" class="form-input">
                                    <p class="text-xs text-gray-500 mt-1">Length of generated part (e.g., 8).</p>
                                </div>
                            </div>
                            <button type="submit" :disabled="isCreatingCoupon || !newCouponData.poolId" class="btn-primary">
                                {{ isCreatingCoupon ? 'Creating...' : (createMode === 'bulk' ? `Create ${bulkOptions.quantity || 0} Coupons` : 'Create Coupon') }}
                            </button>
                        </form>
                        <div class="pt-4">
                            <h3 class="text-lg font-medium text-gray-700 mb-3">Existing Coupons</h3>
                            <div v-if="isLoadingCoupons" class="loading-text">Loading coupons...</div>
                            <ul v-else-if="coupons.length > 0" class="table-list">
                                <li v-for="coup in coupons" :key="coup.id" class="table-list-item">
                                    <div>
                                        <span class="font-mono bg-gray-100 px-1 rounded">{{ coup.code }}</span>
                                        <br/>
                                        <span class="text-xs text-gray-500">
                                            Pool: {{ coup.pool?.name || 'N/A' }} |
                                            Camp: {{ coup.campaign?.name || 'N/A' }} |
                                            Status: <span :class="getCouponStatusClass(coup.status)">{{ coup.status }}</span> |
                                            Expires: {{ formatDateTime(coup.expiresAt) }}
                                        </span>
                                    </div>
                                    <button @click="handleDeleteCoupon(coup.id)" :disabled="isDeletingCoupon === coup.id" class="btn-danger-xs">
                                        {{ isDeletingCoupon === coup.id ? 'Deleting...' : 'Delete' }}
                                    </button>
                                </li>
                            </ul>
                            <div v-else class="italic-text">No coupons found.</div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive, computed } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import Sidebar from '~/components/admin/Sidebar.vue'; // Adjust path if needed
  
  // --- Configuration & Constants ---
  const API_BASE_URL = 'http://localhost:8000'; // Your API base URL
  const userTiers = ['GOLD', 'SILVER', 'BRONZE']; // From Prisma Schema
  const discountTypes = ['PERCENTAGE', 'FIXED_AMOUNT'];
  const couponStatuses = ['AVAILABLE', 'ALLOCATED', 'EXPIRED', 'USED'];
  
  // --- API Client Setup ---
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });
  
  // --- SweetAlert Configuration --- (Copied from your EMS example)
  const swalConfirmDelete = {
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
          confirmButton: 'bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded',
          cancelButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-3'
      },
      buttonsStyling: false
  };
  const swalSuccess = (title, text) => Swal.fire({ title, text, icon: 'success', confirmButtonColor: '#333' });
  const swalError = (title, text) => Swal.fire({ title, text, icon: 'error', confirmButtonColor: '#d33' });
  const handleApiError = (err, defaultMessage = 'An operation failed.') => {
    console.error("API Error:", err.response?.data || err.message || err);
    const message = err.response?.data?.message || err.message || defaultMessage;
    swalError('Error', message);
  };
  
  // --- Tab Management ---
  const activeTab = ref('campaigns'); // Default tab
  const tabs = [
    { id: 'campaigns', name: 'Campaigns' },
    { id: 'pools', name: 'Coupon Pools' },
    { id: 'coupons', name: 'Coupons' },
  ];
  
  // --- State ---
  
  // Campaigns
  const campaigns = ref([]);
  const isLoadingCampaigns = ref(false);
  const isCreatingCampaign = ref(false);
  const isDeletingCampaign = ref(null); // Store ID being deleted
  const newCampaign = ref({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      userTier: ''
  });
  
  // Coupon Pools
  const couponPools = ref([]);
  const isLoadingPools = ref(false);
  const isCreatingPool = ref(false);
  const isDeletingPool = ref(null);
  const isAssigningPool = ref(null); // Store ID being assigned
  const newPool = ref({
      name: '',
      description: '',
      totalCoupons: 100 // Default value
  });
  const selectedCampaignForNewPool = ref(''); // Campaign ID for assignment during pool creation
  const assignCampaignMap = reactive({}); // Map poolId -> selected campaignId for assigning existing pools
  
  // Coupons
  const coupons = ref([]);
  const isLoadingCoupons = ref(false);
  const isCreatingCoupon = ref(false);
  const isDeletingCoupon = ref(null);
  const createMode = ref('single'); // 'single' or 'bulk'
  const newCouponData = ref({ // Shared data for single/bulk
      poolId: '',
      code: '', // Only for single mode
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 0,
      maxDiscountValue: 100,
      usageLimit: 1,
      expiresAt: '',
      // Fields below are *not* sent directly, used for bulk generation
      // quantity: 10,
      // prefix: '',
      // length: 8
  });
  const bulkOptions = ref({
      quantity: 10,
      prefix: '',
      length: 8
  });
  
  
  // --- Helper Functions --- (Copied and slightly adapted)
  const toISOStringOrUndefined = (inputString) => {
      if (!inputString) return undefined;
      try {
          const date = new Date(inputString);
          if (isNaN(date.getTime())) throw new Error('Invalid Date');
          return date.toISOString();
      } catch (e) {
          console.error(`Invalid date string: '${inputString}'`, e);
          swalError('Input Error', `Invalid date/time format provided: ${inputString}. Please use the date picker.`);
          return null; // Return null to indicate error during conversion
      }
  };
  
  const formatDate = (dateString) => { /* ... from EMS example ... */
       if (!dateString) return 'N/A';
        try {
            const datePart = dateString.split('T')[0];
            const date = new Date(datePart + 'T00:00:00');
            return date.toLocaleDateString('en-CA');
        } catch (e) { return dateString; }
  };
  const formatDateTime = (dateTimeString) => { /* ... from EMS example ... */
        if (!dateTimeString) return 'N/A';
        try {
            const date = new Date(dateTimeString);
            return `${date.toLocaleDateString('en-CA')} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
        } catch (e) { return dateTimeString; }
  };
  
  // Generate random string for coupon codes
  const generateRandomCode = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // Status Badge Styling
  const getCouponStatusClass = (status) => {
        switch (status?.toUpperCase()) {
            case 'AVAILABLE': return 'status-badge-gray';
            case 'ALLOCATED': return 'status-badge-blue'; // Or yellow for pending usage?
            case 'USED': return 'status-badge-green';
            case 'EXPIRED': return 'status-badge-red';
            default: return 'status-badge-gray';
        }
  };
  
  
  // --- API Functions ---
  
  // Campaigns
  const fetchCampaigns = async () => {
    isLoadingCampaigns.value = true;
    try {
      const response = await apiClient.get('/campaign');
      campaigns.value = response.data || [];
    } catch (err) { handleApiError(err, 'Could not fetch campaigns.'); }
    finally { isLoadingCampaigns.value = false; }
  };
  
  const handleCreateCampaign = async () => {
    isCreatingCampaign.value = true;
    const startDateISO = toISOStringOrUndefined(newCampaign.value.startDate);
    const endDateISO = toISOStringOrUndefined(newCampaign.value.endDate);
  
    if (startDateISO === null || endDateISO === null) { // Check for conversion error
        isCreatingCampaign.value = false;
        return; // Error handled by toISOStringOrUndefined
    }
  
    const payload = {
      ...newCampaign.value,
      startDate: startDateISO,
      endDate: endDateISO,
      description: newCampaign.value.description || undefined // Handle optional field
    };
  
    try {
      await apiClient.post('/campaign', payload);
      swalSuccess('Success!', 'Campaign created.');
      newCampaign.value = { name: '', description: '', startDate: '', endDate: '', userTier: '' }; // Reset form
      fetchCampaigns();
    } catch (err) { handleApiError(err, 'Failed to create campaign.'); }
    finally { isCreatingCampaign.value = false; }
  };
  
  const handleDeleteCampaign = async (id) => {
    const result = await Swal.fire(swalConfirmDelete);
    if (result.isConfirmed) {
      isDeletingCampaign.value = id;
      try {
        await apiClient.delete(`/campaign/${id}`);
        swalSuccess('Deleted!', 'Campaign has been deleted.');
        fetchCampaigns(); // Refetch list
        // Also refetch pools if a campaign deletion affects them
        fetchCouponPools();
      } catch (err) { handleApiError(err, 'Failed to delete campaign.'); }
      finally { isDeletingCampaign.value = null; }
    }
  };
  
  // Coupon Pools
  const fetchCouponPools = async () => {
    isLoadingPools.value = true;
    try {
      const response = await apiClient.get('/coupon-pool');
      // Ensure campaign data is included or fetched separately if needed for display
      couponPools.value = response.data?.map(pool => ({
          ...pool,
          campaign: campaigns.value.find(c => c.id === pool.campaignId) || null // Add campaign name locally if needed
      })) || [];
      // Initialize assignCampaignMap for pools without campaigns
      couponPools.value.forEach(pool => {
          if (!pool.campaignId && !(pool.id in assignCampaignMap)) {
              assignCampaignMap[pool.id] = '';
          }
      });
    } catch (err) { handleApiError(err, 'Could not fetch coupon pools.'); }
    finally { isLoadingPools.value = false; }
  };
  
  const handleCreatePool = async () => {
    isCreatingPool.value = true;
    const payload = { ...newPool.value };
  
    try {
      let response;
      if (selectedCampaignForNewPool.value) {
        // Use the endpoint that creates and assigns campaign
        response = await apiClient.post(`/coupon-pool/campaign/${selectedCampaignForNewPool.value}`, payload);
      } else {
        // Use the standard create endpoint
        response = await apiClient.post('/coupon-pool', payload);
      }
      swalSuccess('Success!', 'Coupon Pool created.');
      newPool.value = { name: '', description: '', totalCoupons: 100 }; // Reset form
      selectedCampaignForNewPool.value = ''; // Reset assignment dropdown
      fetchCouponPools(); // Refetch
    } catch (err) { handleApiError(err, 'Failed to create coupon pool.'); }
    finally { isCreatingPool.value = false; }
  };
  
  const handleDeletePool = async (id) => {
     const result = await Swal.fire(swalConfirmDelete);
     if (result.isConfirmed) {
       isDeletingPool.value = id;
       try {
         await apiClient.delete(`/coupon-pool/${id}`);
         swalSuccess('Deleted!', 'Coupon Pool has been deleted.');
         fetchCouponPools(); // Refetch list
         // If deleting a pool might affect coupon list, refetch coupons too
         fetchCoupons();
       } catch (err) { handleApiError(err, 'Failed to delete coupon pool.'); }
       finally { isDeletingPool.value = null; }
     }
  };
  
  const handleAssignPoolToCampaign = async (poolId) => {
      const campaignId = assignCampaignMap[poolId];
      if (!campaignId) {
          swalError('Error', 'Please select a campaign to assign.');
          return;
      }
      isAssigningPool.value = poolId;
      try {
          // Use the PATCH endpoint for assignment
          await apiClient.patch(`/coupon-pool/${poolId}/assign-campaign/${campaignId}`);
          swalSuccess('Success!', 'Pool assigned to campaign. Coupon targets are being generated.');
          assignCampaignMap[poolId] = ''; // Reset dropdown for this pool
          fetchCouponPools(); // Refetch pools to update status/campaign link
          fetchCoupons(); // Refetch coupons as their campaignId/status might change
      } catch (err) {
          handleApiError(err, 'Failed to assign pool to campaign.');
      } finally {
          isAssigningPool.value = null;
      }
  };
  
  
  // Coupons
  const fetchCoupons = async () => {
    isLoadingCoupons.value = true;
    try {
      const response = await apiClient.get('/coupon');
      // Enrich coupon data with pool and campaign names locally if needed
       coupons.value = response.data?.map(coupon => {
          const pool = couponPools.value.find(p => p.id === coupon.poolId);
          const campaign = campaigns.value.find(c => c.id === coupon.campaignId);
          return {
              ...coupon,
              pool: pool || null, // Add pool object
              campaign: campaign || null // Add campaign object
          };
      }) || [];
    } catch (err) { handleApiError(err, 'Could not fetch coupons.'); }
    finally { isLoadingCoupons.value = false; }
  };
  
  const handleCreateCoupon = async () => {
      isCreatingCoupon.value = true;
  
      // --- Common Data Preparation ---
      const expiresAtISO = toISOStringOrUndefined(newCouponData.value.expiresAt);
      if (expiresAtISO === null) { // Check conversion error
          isCreatingCoupon.value = false;
          return;
      }
  
      const commonPayload = {
          poolId: newCouponData.value.poolId,
          discountType: newCouponData.value.discountType,
          discountValue: newCouponData.value.discountValue,
          maxDiscountValue: newCouponData.value.maxDiscountValue,
          minOrderValue: newCouponData.value.minOrderValue,
          usageLimit: newCouponData.value.usageLimit,
          expiresAt: expiresAtISO,
          // isActive: true, // Handled by backend usually
          // status: 'AVAILABLE', // Handled by backend
      };
  
      try {
          if (createMode.value === 'single') {
              // --- Single Coupon Logic ---
              if (!newCouponData.value.code) {
                  swalError('Validation Error', 'Coupon Code is required for single creation.');
                  isCreatingCoupon.value = false;
                  return;
              }
              const singlePayload = {
                  ...commonPayload,
                  code: newCouponData.value.code,
              };
              await apiClient.post('/coupon', singlePayload);
              swalSuccess('Success!', 'Coupon created.');
  
          } else {
              // --- Bulk Coupon Logic ---
              const quantity = bulkOptions.value.quantity;
              if (quantity <= 0 || quantity > 1000) {
                   swalError('Validation Error', 'Number of coupons must be between 1 and 1000.');
                   isCreatingCoupon.value = false;
                   return;
              }
  
              const bulkPayload = [];
              const generatedCodes = new Set(); // To avoid rare collisions within the batch
  
              for (let i = 0; i < quantity; i++) {
                  let code;
                  let attempts = 0;
                  // Generate unique code within the batch
                  do {
                      code = (bulkOptions.value.prefix || '') + generateRandomCode(bulkOptions.value.length);
                      attempts++;
                  } while (generatedCodes.has(code) && attempts < 10); // Safety break
  
                  if (attempts >= 10 && generatedCodes.has(code)) {
                       throw new Error(`Failed to generate a unique code after ${attempts} attempts. Try changing prefix/length.`);
                  }
                  generatedCodes.add(code);
  
                  bulkPayload.push({
                      ...commonPayload,
                      code: code,
                  });
              }
  
              await apiClient.post('/coupon/bulk-create', bulkPayload); // Send array directly
              swalSuccess('Success!', `${quantity} coupons created successfully.`);
          }
  
          // Reset form after success
          newCouponData.value = { poolId: '', code: '', discountType: 'PERCENTAGE', discountValue: 10, minOrderValue: 0, maxDiscountValue: 100, usageLimit: 1, expiresAt: ''};
          bulkOptions.value = { quantity: 10, prefix: '', length: 8 };
          createMode.value = 'single'; // Reset mode
          fetchCoupons(); // Refetch coupons
          fetchCouponPools(); // Refetch pools to update allocated counts
  
      } catch (err) {
          handleApiError(err, `Failed to create ${createMode.value} coupon(s).`);
      } finally {
          isCreatingCoupon.value = false;
      }
  };
  
  
  const handleDeleteCoupon = async (id) => {
     const result = await Swal.fire(swalConfirmDelete);
     if (result.isConfirmed) {
       isDeletingCoupon.value = id;
       try {
         await apiClient.delete(`/coupon/${id}`);
         swalSuccess('Deleted!', 'Coupon has been deleted.');
         fetchCoupons(); // Refetch list
         fetchCouponPools(); // Refetch pools to update allocated count
       } catch (err) { handleApiError(err, 'Failed to delete coupon.'); }
       finally { isDeletingCoupon.value = null; }
     }
  };
  
  
  // --- Lifecycle Hooks ---
  onMounted(async () => {
    await fetchCampaigns(); // Fetch campaigns first
    await fetchCouponPools(); // Then pools (can use campaign data)
    await fetchCoupons(); // Then coupons (can use pool/campaign data)
  });
  
  </script>
  
  <style scoped>
  /* Simple Form Input Styling (Tailwind base) */
  .form-input, .form-select, .form-textarea, .form-radio {
    @apply block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-100 transition duration-150 ease-in-out;
  }
  .form-select {
      @apply bg-white;
  }
  .form-select-sm {
      @apply p-1 text-xs; /* Smaller select for inline use */
  }
  .form-radio {
      @apply h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300;
  }
  
  /* Buttons */
  .btn-primary {
    @apply px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out;
  }
  .btn-secondary-xs {
     @apply px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out;
  }
  .btn-danger-xs {
     @apply px-2 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out;
  }
  
  /* List Styling */
  .table-list {
      @apply space-y-2 border border-gray-200 rounded-md p-3 max-h-96 overflow-y-auto; /* Adjust max-h-*/
  }
  .table-list-item {
      @apply text-sm flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 last:border-b-0;
  }
  
  /* Helper Text */
  .loading-text {
      @apply text-center text-gray-500 py-4;
  }
  .italic-text {
      @apply text-center text-gray-500 italic py-4;
  }
  
  /* Status Badges */
  .status-badge-base {
      @apply px-2 py-0.5 rounded-full text-xs font-medium inline-block;
  }
  .status-badge-gray { @apply status-badge-base bg-gray-100 text-gray-800; }
  .status-badge-blue { @apply status-badge-base bg-blue-100 text-blue-800; }
  .status-badge-green { @apply status-badge-base bg-green-100 text-green-800; }
  .status-badge-red { @apply status-badge-base bg-red-100 text-red-800; }
  .status-badge-yellow { @apply status-badge-base bg-yellow-100 text-yellow-800; }
  
  /* Ensure container takes available space */
  .flex-grow {
      flex-grow: 1;
  }
  
  </style>