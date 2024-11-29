<template>
  <div class="container">
    <h1>Front-end 과제</h1>
    <h2>
      <select v-model="selectedYear">
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>
    </h2>
    <div class="buttons">
      <button @click="addRow">추가</button>
      <button @click="deleteRow">삭제</button>
      <button @click="saveTable">저장</button>
    </div>
    <table>
      <thead>
        <tr>
          <th @click="sortTable('isu')">
            이수
            <span>{{ sortIcons.isu }}</span>
          </th>
          <th @click="sortTable('required')">
            필수
            <span>{{ sortIcons.required }}</span>
          </th>
          <th @click="sortTable('subject')">
            과목명
            <span>{{ sortIcons.subject }}</span>
          </th>
          <th>학점</th>
          <th>출석점수</th>
          <th>과제점수</th>
          <th>중간고사</th>
          <th>기말고사</th>
          <th>총점</th>
          <th>평균</th>
          <th>성적</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in tableData[selectedYear]"
          :key="rowIndex"
          :class="{ selected: selectedRow === rowIndex }"
          @click="selectRow(rowIndex)"
        >
          <td>
            <select v-model="row.isu">
              <option value="교양">교양</option>
              <option value="전공">전공</option>
            </select>
          </td>
          <td>
            <select v-model="row.required">
              <option value="필수">필수</option>
              <option value="선택">선택</option>
            </select>
          </td>
          <td><input v-model="row.subject" type="text" /></td>
          <td><input v-model.number="row.credit" type="number" min="0" max="4" /></td>
          <td><input v-model.number="row.attendance" type="number" min="0" max="20" :disabled="row.credit === 1" /></td>
          <td><input v-model.number="row.assignment" type="number" min="0" max="20" :disabled="row.credit === 1" /></td>
          <td><input v-model.number="row.midterm" type="number" min="0" max="30" :disabled="row.credit === 1" /></td>
          <td><input v-model.number="row.final" type="number" min="0" max="30" :disabled="row.credit === 1" /></td>

          <td>{{ row.total }}</td>
          <td>{{''}}</td>
          <td :style="{ color: row.grade === 'F' ? 'red' : '' }">{{ row.grade }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">합계</td>
          <td>{{ totalCredits }}</td>
          <td>{{ totalAttendance }}</td>
          <td>{{ totalAssignment }}</td>
          <td>{{ totalMidterm }}</td>
          <td>{{ totalFinal }}</td>
          <td>{{ totalTotal }}</td>
          <td>{{ overallAverage }}</td>
          <td>{{ overallGrade }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedYear: "1",
      tableData: {
        1: [],
        2: [],
        3: [],
      },
      selectedRow: -1,
      sortIcons: {
        isu: "▲", // Default is ascending
        required: "▲",
        subject: "▲",
      },
      sortOrder: {
        isu: 1, // 1 for ascending, -1 for descending
        required: 1,
        subject: 1,
      },
    };
  },
  computed: {
    totalCredits() {
      return this.tableData[this.selectedYear].reduce((sum, row) => sum + row.credit, 0);
    },
    totalAttendance() {
      return this.tableData[this.selectedYear].reduce((sum, row) => sum + row.attendance, 0);
    },
    totalAssignment() {
      return this.tableData[this.selectedYear].reduce((sum, row) => sum + row.assignment, 0);
    },
    totalMidterm() {
      return this.tableData[this.selectedYear].reduce((sum, row) => sum + row.midterm, 0);
    },
    totalFinal() {
      return this.tableData[this.selectedYear].reduce((sum, row) => sum + row.final, 0);
    },
    totalTotal() {
      return this.tableData[this.selectedYear].reduce((sum, row) => sum + row.total, 0);
    },
    overallAverage() {
      const rows = this.tableData[this.selectedYear];
      const totalSubjects = rows.filter(row => row.total > 0).length;
      if (totalSubjects === 0) return 0;
      return (this.totalTotal / totalSubjects).toFixed(2);
    },
    overallGrade() {
      const avg = this.overallAverage;
      if (avg >= 90) return "A+";
      if (avg >= 80) return "B0";
      if (avg >= 70) return "C0";
      if (avg >= 60) return "D+";
      return "F";
    },
  },
  methods: {
    addRow() {
      this.tableData[this.selectedYear].push({
        isu: "교양",
        required: "필수",
        subject: "",
        credit: 0,
        attendance: 0,
        assignment: 0,
        midterm: 0,
        final: 0,
        total: 0,
        grade: "",
      });
    },
    deleteRow() {
      if (this.selectedRow === -1) {
        alert("삭제할 행을 선택하세요.");
        return;
      }
      this.tableData[this.selectedYear].splice(this.selectedRow, 1);
      this.selectedRow = -1;
    },
    saveTable() {
    // 과목명 중복 확인 (F 성적은 예외)
    const subjects = new Set();
    for (let row of this.tableData[this.selectedYear]) {
      console.log("현재 과목:", row.subject); // 현재 과목명 출력
      console.log("row : ", row); // row 전체 출력
      console.log("row.grade : ", row.grade); // 성적 확인

      // 성적이 없으면 기본값 설정
      if (row.grade === undefined || row.grade === "") {
        row.grade = "F"; // 기본값을 "F"로 설정 (선택적으로 다른 값을 설정할 수 있음)
      }

      if (row.subject) {
        // 기존에 있는 과목명이 존재하고, 해당 과목이 F가 아니라면 중복을 허용하지 않음
        const isDuplicate = subjects.has(row.subject);
        const isFailing = row.grade === "F";

        console.log(`isDuplicate: ${isDuplicate}`); // 중복 여부 출력
        console.log(`isFailing: ${isFailing}`); // 성적이 F인지 여부 출력

        if (isDuplicate && !isFailing) {
          alert(`중복된 과목명: ${row.subject} (F인 과목은 중복을 허용하지 않습니다)`);
          return;
        }
        subjects.add(row.subject);
      }
    }

    // 유효성 검사
    const invalid = this.tableData[this.selectedYear].some((row) => {
      return (
        !row.subject ||
        row.attendance < 0 ||
        row.attendance > 20 ||
        row.assignment < 0 ||
        row.assignment > 20 ||
        row.midterm < 0 ||
        row.midterm > 30 ||
        row.final < 0 ||
        row.final > 30
      );
    });

    if (invalid) {
      alert("입력된 데이터가 올바르지 않습니다.");
      return;
    }

    // 총점 계산 및 성적 계산
    this.tableData[this.selectedYear].forEach((row) => {
      row.total = row.attendance + row.assignment + row.midterm + row.final;

      if (row.credit === 1) {
        row.grade = "P";
      } else {
        row.grade = row.total >= 90 ? "A+" : row.total >= 80 ? "B0" : row.total >= 70 ? "C0" : row.total >= 60 ? "D+" : "F";
      }
    });
  },
    selectRow(index) {
      this.selectedRow = index;
    },
    sortTable(column) {
      const order = this.sortOrder[column];
      this.tableData[this.selectedYear].sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return -order;
        if (valA > valB) return order;
        return 0;
      });

      // Toggle sort order and icon
      this.sortOrder[column] = -order;
      this.sortIcons[column] = order === 1 ? "▼" : "▲";
    },
  },
};
</script>

<style>
  .container {
    margin: 0 auto;
    max-width: 1000px;
    text-align: center;
    font-family: 'Arial', sans-serif;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  th,
  td {
    padding: 12px;
    text-align: center;
    border: 1px solid #ddd;
    font-size: 14px;
  }

  th {
    background-color: #87CEEB;
    color: white;
    cursor: pointer;
  }

  th:hover {
    background-color: #00BFFF;
  }

  .selected {
    background-color: #d3d3d3;
    font-weight: bold;
  }

  button {
    padding: 10px 20px;
    margin: 5px;
    border: none;
    border-radius: 4px;
    background-color: #87CEEB;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #00BFFF;
  }

  button:active {
    background-color: #00BFFF;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  tfoot {
    background-color: #f1f1f1;
    font-weight: bold;
  }

  input[type="text"], input[type="number"], select {
    padding: 8px;
    margin: 4px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 14px;
  }

  input[type="text"]:focus, input[type="number"]:focus, select:focus {
    border-color: #87CEEB;
    outline: none;
  }
</style>
