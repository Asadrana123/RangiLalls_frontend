import React from 'react';

const ContentContributionPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-semibold mb-6">Content Contribution, Moderation & Approval Policy (CMAP)</h1>
          <p className="mb-4">
            Content needs to be contributed by the authorized Content Managers of Rangilalls in a consistent fashion to maintain uniformity and to bring in standardization along with associated metadata and keywords. In order to present the content as per the requirement of the viewer, organize the content in categorized manner and to retrieve the relevant content efficiently, it is required to contribute the content to the website through a Content Management System which would be web-based having user-friendly interface.
          </p>
          
          <p className="mb-4">
            The content on the portal goes through the entire life-cycle process of:-
          </p>
          
          <ul className="list-disc ml-8 mb-4">
            <li>Creation</li>
            <li>Modification</li>
            <li>Approval</li>
            <li>Publishing</li>
            <li>Expiry</li>
            <li>Archival</li>
          </ul>
          
          <p className="mb-4">
            Once the content is contributed it needs to be approved and moderated prior to being published on the Website. The moderation could be multilevel and is role based. If the content is rejected at any level then it is reverted back to the originator of the content for modification.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Different Content Element is categorized as:-</h2>
          
          <p className="mb-4">
            <strong>Routine:</strong> In routine policy, Content once uploaded by the contributor is checked by himself by going through a checklist, once checklist is fulfilled, content will get forwarded to the assigned Head of department called as Approver for the review. For reviewing the content, Approver will go through the defined checklist, will give his suggestion or remarks and forward the content to Website Information Manager i.e. Moderator for Moderation.
          </p>
          
          <p className="mb-4">
            Website Information Manager Review the content by assuring that content is following all checklist points, will give his suggestion or remarks and forwards it to the Publisher. Publisher will upload the content in the website and will give his remarks. Once Publisher Publish the content, contributor can check the content in live website and give his feedback whether the content is uploaded as per his expectations or not and accordingly contributor accept and decline the work done by publisher.
          </p>
          
          <p className="mb-4">
            <strong>Priority:</strong> - Content which are to be uploaded on a priority basis.
          </p>
          
          <p className="mb-4">
            In Priority policy, Content once uploaded by the contributor is checked by himself by going through a checklist, once checklist is fulfilled, content will get forwarded to Approver for Approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentContributionPolicy;