Real User Experience Test (rUXt)
=================

A tool to visualize the Real User Monitoring (RUM) data for 1,241,019 websites from Google Chrome users under various device and connection types.

# How to use rUXt

- Go to [https://ruxt.dexecure.com](https://ruxt.dexecure.com).
- Select a website using the autocomplete.
- (Optional) select a device and connection type.
- Use the time slider to select the user wait time.

# How to interprate the results

Assume 1000 website visitors. You can think of the actual number of visitors scaled down proportionately to 1000.

- <svg xmlns="http://www.w3.org/2000/svg" width="7.844" height="18.163" viewBox="0 0 7.844 18.163" style="fill:#ffffff;stroke:#153b58"><path d="M.507 6.568v4.797a.92.92 0 0 0 .917.917h.351v4.324a.92.92 0 0 0 .917.917h2.46a.92.92 0 0 0 .917-.917v-4.34h.351a.92.92 0 0 0 .917-.916V6.568a.92.92 0 0 0-.917-.917H1.424a.91.91 0 0 0-.917.917z" stroke-width=".153"></path><circle cx="3.914" cy="2.764" r="2.124" stroke-width=".153"></circle></svg> : no content loaded
- <svg xmlns="http://www.w3.org/2000/svg" width="7.844" height="18.163" viewBox="0 0 7.844 18.163" style="fill:#5486AA;stroke:#153b58"><path d="M.507 6.568v4.797a.92.92 0 0 0 .917.917h.351v4.324a.92.92 0 0 0 .917.917h2.46a.92.92 0 0 0 .917-.917v-4.34h.351a.92.92 0 0 0 .917-.916V6.568a.92.92 0 0 0-.917-.917H1.424a.91.91 0 0 0-.917.917z" stroke-width=".153"></path><circle cx="3.914" cy="2.764" r="2.124" stroke-width=".153"></circle></svg> : some content loaded
- ![onload human](/static/onload-human.png) : document loaded

# Metrics

- [Site Experience Benchmark (SEB)](https://dexecure.com/blog/chrome-user-experience-report-explained-google-bigquery/#diving-into-the-important-questions-wheee) score: the fraction of users completing first contentful paint within first second.
- The percentage of users completing [first contentful paint](https://developers.google.com/web/updates/2017/06/user-centric-performance-metrics#first_paint_and_first_contentful_paint) within given time.
- The percentage of users completing document load within given time.

# Learn more
- Read more on CrUX and the metrics for user experience in the [introductory article on CrUX](https://dexecure.com/blog/chrome-user-experience-report-explained-google-bigquery/).
- This is the repo for the frontend. The repo for backend is [here](https://github.com/Dexecure/ruxt-backend). Feedback and pull requests welcome.
- Reach out at [coffee@dexecure.com](mailto:coffee@dexecure.com).