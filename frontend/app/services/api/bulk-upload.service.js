const BulkUploadService = (a, f, d) => {
  checkMissingHeaders(a)
  upload(f, d)
}

export default BulkUploadService;