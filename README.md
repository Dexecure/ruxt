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

- ![loading human](/static/loading-human.png) : no content loaded
- ![fcp human](/static/fcp-human.png) : some content loaded
- ![onload human](/static/onload-human.png) : document loaded

# Metrics

- [Site Experience Benchmark (SEB)](https://dexecure.com/blog/chrome-user-experience-report-explained-google-bigquery/#diving-into-the-important-questions-wheee) score: the fraction of users completing first contentful paint within first second.
- The percentage of users completing [first contentful paint](https://developers.google.com/web/updates/2017/06/user-centric-performance-metrics#first_paint_and_first_contentful_paint) within given time.
- The percentage of users completing document load within given time.

# How to install rUXt

We use [Next.js](https://github.com/zeit/next.js/) for the frontend.

- `npm install` to install all dependencies.
- `npm run dev` to run locally.

# Learn more
- Read more on CrUX and the metrics for user experience in the [introductory article on CrUX](https://dexecure.com/blog/chrome-user-experience-report-explained-google-bigquery/).
- This is the repo for the frontend. The repo for backend is [here](https://github.com/Dexecure/ruxt-backend). Feedback and pull requests welcome.
- Reach out at [coffee@dexecure.com](mailto:coffee@dexecure.com).