using System;
using System.Windows.Forms;

namespace DateTimeChecker
{
    public partial class MainForm : Form
    {
        private TextBox txtDay;
        private TextBox txtMonth;
        private TextBox txtYear;
        private Button btnCheck;
        private Button btnClear;

        public MainForm()
        {
            InitializeComponent();
            InitializeUI();
        }

        private void InitializeUI()
        {
            this.Text = "Date Time Checker";
            this.Size = new System.Drawing.Size(400, 300);

            // Create and position controls
            Label lblDay = new Label { Text = "Day:", Location = new System.Drawing.Point(20, 20) };
            txtDay = new TextBox { Location = new System.Drawing.Point(120, 20), Width = 200 };

            Label lblMonth = new Label { Text = "Month:", Location = new System.Drawing.Point(20, 60) };
            txtMonth = new TextBox { Location = new System.Drawing.Point(120, 60), Width = 200 };

            Label lblYear = new Label { Text = "Year:", Location = new System.Drawing.Point(20, 100) };
            txtYear = new TextBox { Location = new System.Drawing.Point(120, 100), Width = 200 };

            btnCheck = new Button { Text = "Check", Location = new System.Drawing.Point(120, 140), Width = 90 };
            btnClear = new Button { Text = "Clear", Location = new System.Drawing.Point(230, 140), Width = 90 };

            // Add controls to form
            this.Controls.AddRange(new Control[] { lblDay, txtDay, lblMonth, txtMonth, lblYear, txtYear, btnCheck, btnClear });

            // Add event handlers
            btnCheck.Click += BtnCheck_Click;
            btnClear.Click += BtnClear_Click;
        }

        private void BtnCheck_Click(object sender, EventArgs e)
        {
            // Validate empty fields
            if (string.IsNullOrWhiteSpace(txtDay.Text))
            {
                MessageBox.Show("Day cannot be blank.");
                return;
            }
            if (string.IsNullOrWhiteSpace(txtMonth.Text))
            {
                MessageBox.Show("Month cannot be blank.");
                return;
            }
            if (string.IsNullOrWhiteSpace(txtYear.Text))
            {
                MessageBox.Show("Year cannot be blank.");
                return;
            }

            // Validate numeric inputs
            if (!int.TryParse(txtDay.Text, out int day))
            {
                MessageBox.Show("Day is not a number.");
                return;
            }
            if (!int.TryParse(txtMonth.Text, out int month))
            {
                MessageBox.Show("Month is not a number.");
                return;
            }
            if (!int.TryParse(txtYear.Text, out int year))
            {
                MessageBox.Show("Year is not a number.");
                return;
            }

            // Validate ranges
            if (year < 1000)
            {
                MessageBox.Show("Year out of range.");
                return;
            }
            if (month < 1 || month > 12)
            {
                MessageBox.Show("Month out of range.");
                return;
            }

            // Check if date is valid
            bool isValid = IsValidDate(day, month, year);
            string message = $"{day}/{month}/{year} is {(isValid ? "a valid" : "not a valid")} date.";
            MessageBox.Show(message);
        }

        private void BtnClear_Click(object sender, EventArgs e)
        {
            txtDay.Clear();
            txtMonth.Clear();
            txtYear.Clear();
        }

        private bool IsValidDate(int day, int month, int year)
        {
            // Check if day is within valid range for the month
            int[] daysInMonth = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

            // Adjust February for leap year
            if (month == 2 && IsLeapYear(year))
            {
                daysInMonth[2] = 29;
            }

            return day >= 1 && day <= daysInMonth[month];
        }

        private bool IsLeapYear(int year)
        {
            return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
        }
    }
} 