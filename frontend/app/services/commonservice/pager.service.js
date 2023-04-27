const PagerService = {
  getRange(startPage, endPage) {
    let pageArray = []
    for (let i=0; i<endPage; i++){
      pageArray.push(i+1)
    }
    return(pageArray)
  },
  getPager(totalItems, currentPage, pageSizeRequest) {
    let pageSize = pageSizeRequest || 10
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    let startPage, endPage;
    // if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    // } else {
    //   // more than 10 total pages so calculate start and end pages
    //   if (currentPage <= pageSize*2) {
    //     startPage = 1;
    //     endPage = pageSize*2;
    //   } else if (currentPage + pageSize*2+1 >= totalPages) {
    //     startPage = totalPages - pageSize*3;
    //     endPage = totalPages;
    //   } else {
    //     startPage = currentPage - pageSize*2-1;
    //     endPage = currentPage + pageSize+1;
    //   }
    // }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize-1);

    // create an array of pages to repeat in the pager control
    const pages = this.getRange(startPage, endPage);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
}
 export default PagerService